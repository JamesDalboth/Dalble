import { render, screen } from '@testing-library/react';

import "@testing-library/jest-dom";

import Line from './Line';

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
    guesses: [],
    answers: [],
  },
  stats: {
    lastDate: '',
    fail: 0,
    success: [0, 0, 0, 0, 0, 0]
  }
}

describe("Testing Line", () => {
  let providerProps;
  beforeEach(
  () =>
    (providerProps = {
        state: {...defaultState},
        setState: jest.fn(function () {})
      })
  );
  test('Renders line', () => {
    customRender(<Line guess = "ABC"/>, { providerProps });
    expect(screen.getByText(/^A$/)).toHaveTextContent("A");
    expect(screen.getByText(/^B$/)).toHaveTextContent("B");
    expect(screen.getByText(/^C$/)).toHaveTextContent("C");
  });
  test('Renders complete line', () => {
    customRender(<Line guess = "ABCDE" complete = {true} />, { providerProps });
    expect(screen.getByText(/^A$/)).toHaveTextContent("A");
    expect(screen.getByText(/^B$/)).toHaveTextContent("B");
    expect(screen.getByText(/^C$/)).toHaveTextContent("C");
    expect(screen.getByText(/^D$/)).toHaveTextContent("D");
    expect(screen.getByText(/^E$/)).toHaveTextContent("E");
  });
});

