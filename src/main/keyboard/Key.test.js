import { render, screen } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import Key from './Key';

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

describe("Testing Key", () => {
  let providerProps;
  beforeEach(
  () =>
    (providerProps = {
        state: JSON.parse(JSON.stringify(defaultState)),
        setState: jest.fn(function (state) {})
      })
  );

  test('Renders key', () => {
    customRender(<Key value = "A"/>, { providerProps });
    expect(screen.getByText(/^A$/)).toHaveTextContent("A");
  });
  test('Renders enter key', () => {
    customRender(<Key enter = {true}/>, { providerProps });
    expect(screen.getByText(/^Enter$/)).toHaveTextContent("Enter");
    expect(screen.getByText(/^Enter$/)).toHaveClass("Special");
  });
  test('Renders delete key', () => {
    customRender(<Key delete = {true}/>, { providerProps });
    expect(screen.getByText(/^Delete$/)).toHaveTextContent("Delete");
    expect(screen.getByText(/^Delete$/)).toHaveClass("Special");
  });
  test('Renders key as incorrect', () => {
    providerProps.state.puzzle.letters.incorrect = ["A"];
    customRender(<Key value = "A"/>, { providerProps });
    expect(screen.getByText(/^A$/)).toHaveClass("Incorrect");
  });

  test('Press key adds letter to guess', () => {
    customRender(<Key value = "A"/>, { providerProps });
    const button = screen.getByText(/^A$/);

    const expectedState = JSON.parse(JSON.stringify(providerProps.state));
    expectedState.puzzle.currentGuess = ["A"];

    userEvent.click(button);

    expect(providerProps.setState.mock.calls[0][0]).toStrictEqual(expectedState);
  });
  test('Press key does nothing if guess at max length', () => {
    providerProps.state.puzzle.currentGuess = ["A", "B", "C", "D", "E"];
    customRender(<Key value = "F"/>, { providerProps });
    const button = screen.getByText(/^F$/);
    userEvent.click(button);

    expect(providerProps.setState.mock.calls).toHaveLength(0);
  });

  test('Delete key removes letter from guess', () => {
    providerProps.state.puzzle.currentGuess = ["A", "B", "C", "D", "E"];
    customRender(<Key delete = {true}/>, { providerProps });
    const button = screen.getByText(/^Delete$/);

    const expectedState = JSON.parse(JSON.stringify(providerProps.state));
    expectedState.puzzle.currentGuess = ["A", "B", "C", "D"];

    userEvent.click(button);

    expect(providerProps.setState.mock.calls[0][0]).toStrictEqual(expectedState);
  });
  test('Delete key does nothing if guess empty', () => {
    providerProps.state.puzzle.currentGuess = [];
    customRender(<Key delete = {true}/>, { providerProps });
    const button = screen.getByText(/^Delete$/);
    userEvent.click(button);

    expect(providerProps.setState.mock.calls).toHaveLength(0);
  });

  test('Enter key does nothing if guess incomplete', () => {
    providerProps.state.puzzle.currentGuess = ["A", "B", "C", "D"];
    customRender(<Key enter = {true}/>, { providerProps });
    const button = screen.getByText(/^Enter$/);
    userEvent.click(button);

    expect(providerProps.setState.mock.calls).toHaveLength(0);
  });
  test('Enter key does nothing if guess is not a word', () => {
    providerProps.state.puzzle.currentGuess = ["A", "B", "C", "D", "E"];
    customRender(<Key enter = {true}/>, { providerProps });
    const button = screen.getByText(/^Enter$/);
    userEvent.click(button);

    expect(providerProps.setState.mock.calls).toHaveLength(0);
  });
  test('Enter key submits an incorrect guess', () => {
    providerProps.state.puzzle.currentGuess = ["J", "U", "D", "G", "E"];
    providerProps.state.puzzle.word = "FUDGE";
    customRender(<Key enter = {true}/>, { providerProps });
    const button = screen.getByText(/^Enter$/);

    const expectedState = JSON.parse(JSON.stringify(providerProps.state));
    expectedState.puzzle.currentGuess = []
    expectedState.puzzle.guesses = [["J", "U", "D", "G", "E"]]

    userEvent.click(button);

    expect(providerProps.setState.mock.calls[0][0]).toStrictEqual(expectedState);
  });
  test('Enter key submits an incorrect final guess', () => {
    providerProps.state.puzzle.guesses = [["J", "U", "D", "G", "E"], ["J", "U", "D", "G", "E"], ["J", "U", "D", "G", "E"], ["J", "U", "D", "G", "E"], ["J", "U", "D", "G", "E"]];
    providerProps.state.puzzle.currentGuess = ["J", "U", "D", "G", "E"];
    providerProps.state.puzzle.word = "FUDGE";
    customRender(<Key enter = {true}/>, { providerProps });
    const button = screen.getByText(/^Enter$/);

    const expectedState = JSON.parse(JSON.stringify(providerProps.state));

    userEvent.click(button);

    expectedState.puzzle.currentGuess = [];
    expectedState.puzzle.guesses = [["J", "U", "D", "G", "E"], ["J", "U", "D", "G", "E"], ["J", "U", "D", "G", "E"], ["J", "U", "D", "G", "E"], ["J", "U", "D", "G", "E"], ["J", "U", "D", "G", "E"]];
    expectedState.stats.fail = 1;
    expect(providerProps.setState.mock.calls[0][0]).toStrictEqual(expectedState);
  });
  test('Enter key submits an correct guess', () => {
    providerProps.state.puzzle.guesses = [["J", "U", "D", "G", "E"]];
    providerProps.state.puzzle.currentGuess = ["J", "U", "D", "G", "E"];
    providerProps.state.puzzle.word = "JUDGE";
    customRender(<Key enter = {true}/>, { providerProps });
    const button = screen.getByText(/^Enter$/);

    const expectedState = JSON.parse(JSON.stringify(providerProps.state));

    userEvent.click(button);

    expectedState.puzzle.currentGuess = [];
    expectedState.puzzle.guesses = [["J", "U", "D", "G", "E"], ["J", "U", "D", "G", "E"]];
    expectedState.stats.success = [0, 1, 0, 0, 0, 0];
    expect(providerProps.setState.mock.calls[0][0]).toStrictEqual(expectedState);
  });
});

