import { render, screen, waitFor } from '@testing-library/react';

import "@testing-library/jest-dom";

import Stats from './Stats';

import { GameContext } from './Game';

const customRender = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <GameContext.Provider value={providerProps}>{ui}</GameContext.Provider>,
    renderOptions
  );
};

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

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe("Testing Stats", () => {
  let providerProps;
  beforeEach(() => {
    providerProps = {
      state: JSON.parse(JSON.stringify(defaultState))
    }
    window.ResizeObserver = ResizeObserver;
  });

  test('Renders basic stats', async () => {
    const state = JSON.parse(JSON.stringify(defaultState));
    state.stats.fail = 5;
    state.stats.success = [1, 2, 3, 4, 5, 6];

    providerProps.state = state;

    customRender(<Stats/>, { providerProps });

    await waitFor(() => {
      expect(screen.getByText(/^WIN/)).toHaveTextContent("80.77%");
      expect(screen.getByText(/^WIN/)).toHaveTextContent("26");
    });
  });

  test('Renders last word answer', async () => {
    const state = JSON.parse(JSON.stringify(defaultState));
    state.stats.fail = 5;
    state.stats.success = [1, 2, 3, 4, 5, 6];
    state.puzzle.word = "FUDGE"

    providerProps.state = state;

    customRender(<Stats/>, { providerProps });

    await waitFor(() => {
      expect(screen.getByText(/NEXT/)).toHaveTextContent("FUDGE");
    });
  });
});
