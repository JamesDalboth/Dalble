import { render, screen } from '@testing-library/react';

import "@testing-library/jest-dom";

import Box from './Box';

import { GameContext } from '../Game';

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
    guesses: ["fudge", "judge"],
    answers: ["fudge", "judge"],
  },
  stats: {
    lastDate: '',
    fail: 0,
    success: [0, 0, 0, 0, 0, 0]
  }
}

describe("Testing Box", () => {
  let providerProps;
  beforeEach(
  () =>
    (providerProps = {
        state: JSON.parse(JSON.stringify(defaultState)),
        setState: jest.fn(function (state) {})
      })
  );

  test('Renders box with non-complete letter', () => {
    customRender(<Box value = "A"/>, { providerProps });
    expect(screen.getByText(/^A$/)).toHaveTextContent("A");
  });
  test('Renders box with complete correct letter', () => {
    providerProps.state.puzzle.word = "JUDGE";

    const expectedState = JSON.parse(JSON.stringify(providerProps.state));
    expectedState.puzzle.letters.correct = "J";

    customRender(<Box value = "J" guess = "JUDGE" index = {0} complete = {true} />, { providerProps });
    expect(screen.getByText(/^J$/)).toHaveTextContent("J");
    expect(screen.getByText(/^J$/)).toHaveClass("Box-Correct");

    expect(providerProps.setState.mock.calls[0][0]).toStrictEqual(expectedState);
  });
  test('Renders box with already known complete correct letter', () => {
    providerProps.state.puzzle.word = "JUDGE";
    providerProps.state.puzzle.letters.correct = "J";

    customRender(<Box value = "J" guess = "JUDGE" index = {0} complete = {true} />, { providerProps });
    expect(screen.getByText(/^J$/)).toHaveTextContent("J");
    expect(screen.getByText(/^J$/)).toHaveClass("Box-Correct");

    expect(providerProps.setState.mock.calls).toHaveLength(0);
  });
  test('Renders box with correct but misaligned letter', () => {
    providerProps.state.puzzle.word = "JUDGE";

    const expectedState = JSON.parse(JSON.stringify(providerProps.state));
    expectedState.puzzle.letters.correct = "U";

    customRender(<Box value = "U" guess = "UJDGE" index = {0} complete = {true} />, { providerProps });
    expect(screen.getByText(/^U$/)).toHaveTextContent("U");
    expect(screen.getByText(/^U$/)).toHaveClass("Box-Miss");

    expect(providerProps.setState.mock.calls[0][0]).toStrictEqual(expectedState);
  });
  test('Renders box with already known correct but misaligned letter', () => {
    providerProps.state.puzzle.word = "JUDGE";
    providerProps.state.puzzle.letters.correct = "U";

    customRender(<Box value = "U" guess = "UJDGE" index = {0} complete = {true} />, { providerProps });
    expect(screen.getByText(/^U$/)).toHaveTextContent("U");
    expect(screen.getByText(/^U$/)).toHaveClass("Box-Miss");

    expect(providerProps.setState.mock.calls).toHaveLength(0);
  });
  test('Renders box with incorrect letter', () => {
    providerProps.state.puzzle.word = "JUDGE";

    const expectedState = JSON.parse(JSON.stringify(providerProps.state));
    expectedState.puzzle.letters.incorrect = "F";

    customRender(<Box value = "F" guess = "FUDGE" index = {0} complete = {true} />, { providerProps });
    expect(screen.getByText(/^F$/)).toHaveTextContent("F");
    expect(screen.getByText(/^F$/)).toHaveClass("Box-Incorrect");

    expect(providerProps.setState.mock.calls[0][0]).toStrictEqual(expectedState);
  });
  test('Renders box with already known incorrect letter', () => {
    providerProps.state.puzzle.word = "JUDGE";
    providerProps.state.puzzle.letters.incorrect = "F";

    customRender(<Box value = "F" guess = "FUDGE" index = {0} complete = {true} />, { providerProps });
    expect(screen.getByText(/^F$/)).toHaveTextContent("F");
    expect(screen.getByText(/^F$/)).toHaveClass("Box-Incorrect");

    expect(providerProps.setState.mock.calls).toHaveLength(0);
  });
});

