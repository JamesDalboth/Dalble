import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "@testing-library/jest-dom";

import Game from './Game';

const defaultState = {
  puzzle: {
    guesses: [],
    currentGuess: [],
    word: '',
    letters: {
      incorrect: [],
      correct: []
    }
  },
  words: {
    guesses: [],
    answers: [],
  },
  stats: {
    lastDate: '',
    fail: 0,
    success: [0, 0, 0, 0, 0, 0]
  }
}

const localStorageMock = (function () {
  let store = {};

  return {
    getItem(key) {
      return store[key];
    },

    forceItem(key, value) {
      store[key] = value;
    },

    setItem(key, value) {
      mockSetItem(key, value)
    },

    clear() {
      store = {};
    },

    removeItem(key) {
      delete store[key];
    },

    getAll() {
      return store;
    },
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

const setLocalStorage = (data) => {
  window.localStorage.forceItem("dalble", JSON.stringify(data));
};

const mockSetItem = jest.fn(function (key, value) {
  setLocalStorage(value);
});

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

const customRender = (ui) => {
  return render(
          <BrowserRouter>
            <Routes>
              <Route path="*" element={ui} />
            </Routes>
          </BrowserRouter>
  );
};

describe("Testing Game", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.ResizeObserver = ResizeObserver;
    global.fetch = jest.fn(function (url) {
      return Promise.resolve({
        text: () => Promise.resolve("JUDGE\nFUDGE\nEARTH"),
      })
    });

    global.Date.prototype.toLocaleDateString = jest.fn(function(locale, date) {return "09/02/2023"});
  });

  test('Renders empty game', async () => {
    const state = JSON.parse(JSON.stringify(defaultState));
    setLocalStorage(state);

    const expectedState = JSON.parse(JSON.stringify(state));
    expectedState.words.guesses = ["JUDGE", "FUDGE", "EARTH"];

    const expectedState2 = JSON.parse(JSON.stringify(expectedState));
    expectedState2.words.answers = ["JUDGE", "FUDGE", "EARTH"];
    expectedState2.puzzle.word = "FUDGE";
    expectedState2.stats.lastDate = "09/02/2023";

    customRender(<Game/>);

    await waitFor(() => {
      expect(screen.getByText(/^DALBLE$/)).toHaveTextContent("DALBLE");
      expect(mockSetItem.mock.calls[1][1]).toStrictEqual(JSON.stringify(expectedState));
      expect(mockSetItem.mock.calls[2][1]).toStrictEqual(JSON.stringify(expectedState2));
    });
  });
  test('Renders empty game with guesses downloaded', async () => {
    const state = JSON.parse(JSON.stringify(defaultState));
    state.words.guesses = ["JUDGE", "FUDGE", "EARTH"];
    setLocalStorage(state);

    const expectedState = JSON.parse(JSON.stringify(state));

    const expectedState2 = JSON.parse(JSON.stringify(expectedState));
    expectedState2.words.answers = ["JUDGE", "FUDGE", "EARTH"]
    expectedState2.puzzle.word = "FUDGE";
    expectedState2.stats.lastDate = "09/02/2023";

    customRender(<Game/>);

    await waitFor(() => {
      expect(screen.getByText(/^DALBLE$/)).toHaveTextContent("DALBLE");
      expect(mockSetItem.mock.calls[0][1]).toStrictEqual(JSON.stringify(expectedState));
      expect(mockSetItem.mock.calls[1][1]).toStrictEqual(JSON.stringify(expectedState2));
    });
  });
  test('Renders empty game with guesses and answers downloaded', async () => {
    const state = JSON.parse(JSON.stringify(defaultState));
    state.words.guesses = ["JUDGE", "FUDGE", "EARTH"];
    state.words.answers = ["JUDGE", "FUDGE", "EARTH"];
    setLocalStorage(state);

    const expectedState = JSON.parse(JSON.stringify(state));
    expectedState.puzzle.word = "FUDGE";
    expectedState.stats.lastDate = "09/02/2023";

    customRender(<Game/>);

    await waitFor(() => {
      expect(screen.getByText(/^DALBLE$/)).toHaveTextContent("DALBLE");
      expect(mockSetItem.mock.calls[0][1]).toStrictEqual(JSON.stringify(expectedState));
    });
  });
  test('Renders empty game with full game setup', async () => {
    const state = JSON.parse(JSON.stringify(defaultState));
    state.words.guesses = ["JUDGE", "FUDGE", "EARTH"];
    state.words.answers = ["JUDGE", "FUDGE", "EARTH"];
    state.puzzle.word = "FUDGE";
    state.stats.lastDate = "09/02/2023";
    setLocalStorage(state);

    customRender(<Game/>);

    await waitFor(() => {
      expect(screen.getByText(/^DALBLE$/)).toHaveTextContent("DALBLE");
      expect(mockSetItem.mock.calls[0][1]).toStrictEqual(JSON.stringify(state));
    });
  });
  test('Renders in progress game', async () => {
    const state = JSON.parse(JSON.stringify(defaultState));
    state.words.guesses = ["JUDGE", "FUDGE", "EARTH"];
    state.words.answers = ["JUDGE", "FUDGE", "EARTH"];
    state.puzzle.guesses = [["J", "U", "D", "G", "E"]];
    state.puzzle.currentGuess = ["F"];
    state.puzzle.word = "FUDGE";
    state.stats.lastDate = "09/02/2023";
    setLocalStorage(state);

    customRender(<Game/>);

    const expectedState = JSON.parse(JSON.stringify(state));
    expectedState.puzzle.letters.incorrect = "J";
    expectedState.puzzle.letters.correct = "UDGE";

    await waitFor(() => {
      expect(screen.getByText(/^DALBLE$/)).toHaveTextContent("DALBLE");
      expect(screen.getAllByText(/^J$/)[0]).toHaveTextContent("J");
      expect(screen.getAllByText(/^U$/)[0]).toHaveTextContent("U");
      expect(screen.getAllByText(/^D$/)[0]).toHaveTextContent("D");
      expect(screen.getAllByText(/^G$/)[0]).toHaveTextContent("G");
      expect(screen.getAllByText(/^E$/)[0]).toHaveTextContent("E");
      expect(screen.getAllByText(/^F$/)[0]).toHaveTextContent("F");
      expect(screen.getAllByText(/^J$/)[0]).toHaveClass("Box-Incorrect");
      expect(screen.getAllByText(/^U$/)[0]).toHaveClass("Box-Correct");
      expect(screen.getAllByText(/^D$/)[0]).toHaveClass("Box-Correct");
      expect(screen.getAllByText(/^G$/)[0]).toHaveClass("Box-Correct");
      expect(screen.getAllByText(/^E$/)[0]).toHaveClass("Box-Correct");
      expect(screen.getAllByText(/^F$/)[0]).toHaveClass("Box");
      expect(mockSetItem.mock.calls[0][1]).toStrictEqual(JSON.stringify(expectedState));
    });
  });
  test('Renders complete failed game', async () => {
    const state = JSON.parse(JSON.stringify(defaultState));
    state.words.guesses = ["JUDGE", "FUDGE", "EARTH"];
    state.words.answers = ["JUDGE", "FUDGE", "EARTH"];
    state.puzzle.guesses = [["A", "A", "A", "A", "A"],["A", "A", "A", "A", "A"],["A", "A", "A", "A", "A"],["A", "A", "A", "A", "A"],["A", "A", "A", "A", "A"], ["A", "A", "A", "A", "A"]];
    state.puzzle.currentGuess = [];
    state.puzzle.word = "FUDGE";
    state.stats.lastDate = "09/02/2023";
    setLocalStorage(state);

    customRender(<Game/>);

    const expectedState = JSON.parse(JSON.stringify(state));
    expectedState.puzzle.letters.incorrect = "A";

    await waitFor(() => {
      expect(screen.queryByText(/^DALBLE$/)).not.toBeInTheDocument("DALBLE");
      expect(mockSetItem.mock.calls[0][1]).toStrictEqual(JSON.stringify(expectedState));
    });
  });
  test('Renders complete success game', async () => {
    const state = JSON.parse(JSON.stringify(defaultState));
    state.words.guesses = ["JUDGE", "FUDGE", "EARTH"];
    state.words.answers = ["JUDGE", "FUDGE", "EARTH"];
    state.puzzle.guesses = [["A", "A", "A", "A", "A"],["A", "A", "A", "A", "A"],["A", "A", "A", "A", "A"],["A", "A", "A", "A", "A"],["A", "A", "A", "A", "A"], ["F", "U", "D", "G", "E"]];
    state.puzzle.currentGuess = [];
    state.puzzle.word = "FUDGE";
    state.stats.lastDate = "09/02/2023";
    setLocalStorage(state);

    customRender(<Game/>);

    const expectedState = JSON.parse(JSON.stringify(state));
    expectedState.puzzle.letters.incorrect = "A";
    expectedState.puzzle.letters.correct = "FUDGE";

    await waitFor(() => {
      expect(screen.queryByText(/^DALBLE$/)).not.toBeInTheDocument("DALBLE");
      expect(mockSetItem.mock.calls[0][1]).toStrictEqual(JSON.stringify(expectedState));
    });
  });
});
