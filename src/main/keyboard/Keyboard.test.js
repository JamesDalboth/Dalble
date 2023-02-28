import { render, screen } from '@testing-library/react';

import "@testing-library/jest-dom";

import Keyboard from './Keyboard';

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

describe("Testing Keyboard", () => {
  let providerProps;
  beforeEach(
  () =>
    (providerProps = {
        state: {...defaultState},
        useState: jest.fn(function () {})
      })
  );
  test('Renders keyboard', () => {
    customRender(<Keyboard />, { providerProps });
    "QWERTYUIOPASDFGHJKLZXCVBNM".split("").map((x) => {
        expect(screen.getByText(new RegExp("^" + x + "$"))).toHaveTextContent(x);
    })
    expect(screen.getByText(/^Enter$/)).toHaveTextContent("Enter");
    expect(screen.getByText(/^Delete$/)).toHaveTextContent("Delete");
  });
});

