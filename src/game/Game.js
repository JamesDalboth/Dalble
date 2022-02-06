import React, { createContext, useState } from 'react';

import {NotificationContainer, NotificationManager} from 'react-notifications';

import 'react-notifications/lib/notifications.css';

import raw from './words.txt';
import './Game.css';

import Line from './Line';
import Keyboard from './Keyboard';
import Title from './Title';

const seedrandom = require('seedrandom');


export const GameContext = createContext();

const defaultState = {
  guesses: [],
  currentGuess: [],
  word: '',
  words: [],
  incorrectLetters: '',
  correctLetters: '',
  lastDate: ''
}

function useStickyState(defaultValue, key) {
  const [value, setValue] = React.useState(() => {
    const stickyValue = window.localStorage.getItem(key);
    return stickyValue !== null
      ? JSON.parse(stickyValue)
      : defaultValue;
  });
  React.useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

function Game() {
  const [state, setState] = useStickyState(defaultState);

  const dateStr = new Date().toLocaleDateString();

  if (state.word === '' || dateStr !== state.lastDate) {
    fetch(raw)
      .then(r => r.text())
      .then(text => {
        const words = text.split(' ');
        const generator = seedrandom(dateStr);
        const randomNumber = Math.floor(generator() * words.length);
        const startState = {
          guesses: [],
          currentGuess: [],
          word: words[randomNumber].toUpperCase(),
          words: words,
          incorrectLetters: state.incorrectLetters,
          correctLetters: state.correctLetters,
          lastDate: dateStr
        };
        setState(startState);
      });
  }

  var complete = false;
  if (state.guesses.length === 6) {
    complete = true;
  }

  if (state.guesses.length > 0) {
    var lastGuess = state.guesses[state.guesses.length - 1];
    var guessStr = '';
    for (var i = 0; i < lastGuess.length; i++) {
      guessStr += lastGuess[i];
    }

    if (guessStr === state.word) {
      complete = true;
    }
  }

  if (complete) {
    return (
      <GameContext.Provider value={{ state, setState }}>
        <div className="Game">
            <Title/>
            {state.guesses.map((guess, i) => {
                return <Line guess={guess} complete={true} key={i}/>
            })}
            {[...Array(6 - state.guesses.length)].map((x, i) =>
                <Line key={state.guesses.length + i}/>
            )}
        </div>
        <NotificationContainer/>
      </GameContext.Provider>
    )
  }

  return (
    <GameContext.Provider value={{ state, setState }}>
      <div className="Game">
          <Title/>
          {state.guesses.map((guess, i) => {
              return <Line guess={guess} complete={true} key={i}/>
          })}
          <Line guess={state.currentGuess} complete={false}/>
          {[...Array(5 - state.guesses.length)].map((x, i) =>
              <Line key={state.guesses.length + i}/>
          )}
          <Keyboard/>
      </div>
      <NotificationContainer/>
    </GameContext.Provider>

  );
}

export default Game;
