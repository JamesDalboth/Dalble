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
  correctLetters: ''
}

function Game() {
  const [state, setState] = useState(defaultState);

  if (state.word === '') {
    fetch(raw)
      .then(r => r.text())
      .then(text => {
        const words = text.split(' ');
        const generator = seedrandom(new Date().toLocaleDateString());
        const randomNumber = Math.floor(generator() * words.length);
        const startState = {
          guesses: [],
          currentGuess: [],
          word: words[randomNumber].toUpperCase(),
          words: words,
          incorrectLetters: state.incorrectLetters,
          correctLetters: state.correctLetters
        };
        setState(startState);
      });
  }

  if (state.guesses.length === 6) {
    return (
      <GameContext.Provider value={{ state, setState }}>
        <div className="Game">
            <Title/>
            {state.guesses.map((guess, i) => {
                return <Line guess={guess} complete={true} key={i}/>
            })}
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
