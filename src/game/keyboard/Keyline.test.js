import { render, screen } from '@testing-library/react';

import "@testing-library/jest-dom";

import { Keyline, ENTER_KEY, DELETE_KEY } from './Keyline';

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

describe("Testing Keyline", () => {
  let providerProps;
  beforeEach(
  () =>
    (providerProps = {
        state: {...defaultState},
        useState: jest.fn(function () {})
      })
  );
  test('Renders keyline with provided keys', () => {
    customRender(<Keyline keys = "ABC"/>, { providerProps });
    expect(screen.getByText(/^A$/)).toHaveTextContent("A");
    expect(screen.getByText(/^B$/)).toHaveTextContent("B");
    expect(screen.getByText(/^C$/)).toHaveTextContent("C");
  });
  test('Renders keyline with enter key', () => {
    customRender(<Keyline keys = {"ABC" + ENTER_KEY}/>, { providerProps });
    expect(screen.getByText(/^Enter$/)).toHaveTextContent("Enter");
  });
  test('Renders keyline with delete key', () => {
    customRender(<Keyline keys = {"ABC" + DELETE_KEY}/>, { providerProps });
    expect(screen.getByText(/^Delete$/)).toHaveTextContent("Delete");
  });
});

