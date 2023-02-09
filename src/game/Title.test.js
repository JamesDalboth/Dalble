import { render, screen } from '@testing-library/react';

import "@testing-library/jest-dom";

import Title from './Title';

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

describe("Testing Title", () => {
  let providerProps;
  beforeEach(
  () =>
    (providerProps = {
        state: {...defaultState},
        useState: jest.fn(function () {})
      })
  );
  test('Renders dalble title', () => {
    customRender(<Title/>, { providerProps });
    expect(screen.getByText(/^DALBLE$/)).toHaveTextContent("DALBLE");
  });
  test('Renders share button', () => {
    customRender(<Title share = {true}/>, { providerProps });
    expect(screen.getByText(/Share/)).toHaveTextContent("Share");
  });
});

