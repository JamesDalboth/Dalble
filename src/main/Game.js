import React, { createContext, useState } from 'react';
import { NotificationContainer } from 'react-notifications';

import 'react-notifications/lib/notifications.css';

import answers_raw from './words/answers.txt';
import guesses_raw from './words/guesses.txt';

import './Game.css';

import Line from './grid/Line';
import Keyboard from './keyboard/Keyboard';
import Title from './Title';
import Stats from './Stats';

import { MAX_NO_GUESSES } from './util/consts.js';
import { pick } from './util/words.js';

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

  // Download valid answer words. Guesses must be downloaded first.
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

  // What to render when guesses and answers are still empty.
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

  const date = new Date();
  const dateStr = date.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  // Setup today
  if (dateStr !== state.stats.lastDate) {
    const startState = {
      puzzle: {
        guesses: [],
        currentGuess: [],
        word: pick(state.words.answers, date),
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
  const lastGuess = guesses.length > 0 ? guesses[guesses.length - 1] : [];
  const word = puzzleInfo.word;
  const lastGuessStr = lastGuess.join("");

  var complete = false;

  // Failure
  if (guesses.length === MAX_NO_GUESSES) {
    complete = true;
  }

  // Success
  if (guesses.length > 0) {
    if (lastGuessStr === word) {
      complete = true;
    }
  }

  if (complete) {
    return (
      <GameContext.Provider value={{ state, setState }}>
        <div className="Game">
            <Title share={true}/>
            {guesses.map((guess, i) => {
                return <Line guess={guess} complete={true} key={i}/>
            })}
            {[...Array(MAX_NO_GUESSES - guesses.length)].map((x, i) =>
                <Line key={guesses.length + i}/>
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
          <Title share={false}/>
          {guesses.map((guess, i) => {
              return <Line guess={guess} complete={true} key={i}/>
          })}
          <Line guess={puzzleInfo.currentGuess} complete={false}/>
          {[...Array(MAX_NO_GUESSES - 1 - guesses.length)].map((x, i) =>
              <Line key={guesses.length + i}/>
          )}
          <Keyboard/>
      </div>
      <NotificationContainer/>
    </GameContext.Provider>

  );
}

export default Game;
