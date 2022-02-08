import React, { createContext, useState } from 'react';
import {NotificationContainer, NotificationManager} from 'react-notifications';

import 'react-notifications/lib/notifications.css';

import answers_raw from './words.txt';
import guesses_raw from './guesses.txt';

import './Game.css';

import Line from './Line';
import Keyboard from './Keyboard';
import Title from './Title';
import Stats from './Stats';

const seedrandom = require('seedrandom');

export const GameContext = createContext();

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

function useStickyState(defaultValue, key) {
  const [value, setValue] = useState(() => {
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
  const [state, setState] = useStickyState(defaultState, "dalble");

  const dateStr = new Date().toLocaleDateString('en-GB');

  // Migrate old stats
  if (state.lastDate !== undefined && state.stats.lastDate === undefined) {
    const newState = {
      puzzle: {
        guesses: state.guesses,
        currentGuess: state.currentGuess,
        word: state.word,
        letters: {
          incorrect: state.incorrectLetters,
          correct: state.correctLetters
        }
      },
      words: {
        guesses: [],
        answers: [],
      },
      stats: {
        lastDate: state.lastDate,
        fail: state.stats.fail,
        success: state.stats.success
      }
    }
    setState(newState);
    return;
  }

  // Download valid guess words
  if (state.words.guesses.length === 0) {
    console.log("Downloading guesses...");
    fetch(guesses_raw)
      .then(r => r.text())
      .then(text => {
        const words = text.split('\n');
        const newState = {
          puzzle: state.puzzle,
          words: {
            guesses: words,
            answers: state.words.answers
          },
          stats: state.stats
        };
        setState(newState);
      });
  }

  // Download valid answer words
  if (state.words.guesses.length > 0 && state.words.answers.length === 0) {
    console.log("Downloading answers...");
    fetch(answers_raw)
      .then(r => r.text())
      .then(text => {
        const words = text.split('\n');
        const newState = {
          puzzle: state.puzzle,
          words: {
            guesses: state.words.guesses,
            answers: words
          },
          stats: state.stats
        };
        setState(newState);
      });
  }

  if (state.words.guesses.length === 0 || state.words.answers.length === 0) {
    return (
      <GameContext.Provider value={{ state, setState }}>
        <div className="Game">
            <Title/>
        </div>
        <NotificationContainer/>
      </GameContext.Provider>
    );
  }

  // Setup today
  if (dateStr !== state.stats.lastDate && state.words.guesses.length !== 0 && state.words.answers.length !== 0) {
    console.log("Setting up puzzle for today...");
    const generator = seedrandom(dateStr);
    const randomNumber = Math.floor(generator() * state.words.answers.length);
    const startState = {
      puzzle: {
        guesses: [],
        currentGuess: [],
        word: state.words.answers[randomNumber].toUpperCase(),
        letters: {
          incorrect: [],
          correct: []
        }
      },
      words: state.words,
      stats: {
        lastDate: dateStr,
        fail: state.stats.fail,
        success: state.stats.success
      }
    };
    setState(startState);
  }

  const puzzleInfo = state.puzzle;
  const guesses = puzzleInfo.guesses;
  const noGuesses = guesses.length;
  const lastGuess = guesses[noGuesses - 1];
  const word = puzzleInfo.word;
  var lastGuessStr = '';

  var complete = false;
  if (noGuesses === 6) {
    complete = true;
  }

  if (noGuesses > 0) {
    for (var i = 0; i < lastGuess.length; i++) {
      lastGuessStr += lastGuess[i];
    }

    if (lastGuessStr === word) {
      complete = true;
    }
  }

  if (complete) {
    return (
      <GameContext.Provider value={{ state, setState }}>
        <div className="Game">
            <Title/>
            {guesses.map((guess, i) => {
                return <Line guess={guess} complete={true} key={i}/>
            })}
            {[...Array(6 - noGuesses)].map((x, i) =>
                <Line key={noGuesses + i}/>
            )}
            <Stats/>
        </div>
        <NotificationContainer/>
      </GameContext.Provider>
    )
  }

  return (
    <GameContext.Provider value={{ state, setState }}>
      <div className="Game">
          <Title/>
          {guesses.map((guess, i) => {
              return <Line guess={guess} complete={true} key={i}/>
          })}
          <Line guess={puzzleInfo.currentGuess} complete={false}/>
          {[...Array(5 - noGuesses)].map((x, i) =>
              <Line key={noGuesses + i}/>
          )}
          <Keyboard/>
      </div>
      <NotificationContainer/>
    </GameContext.Provider>

  );
}

export default Game;
