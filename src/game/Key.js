import { useContext } from 'react';
import {NotificationContainer, NotificationManager} from 'react-notifications';

import './Key.css';
import { GameContext } from './Game';

function Key(props) {
  const { state, setState } = useContext(GameContext);
  
  function pressKey(key) {
    var currentGuess = state.currentGuess;
    if (currentGuess.length === 5) {
      return;
    }

    const newState = {
      guesses: state.guesses,
      currentGuess: [...state.currentGuess, key],
      word: state.word,
      words: state.words,
      incorrectLetters: state.incorrectLetters,
      correctLetters: state.correctLetters,
      lastDate: state.lastDate,
      stats: state.stats,
      statev: state.statev
    }

    setState(newState);
  }

  function del() {
    var currentGuess = state.currentGuess;
    if (currentGuess.length === 0) {
      return;
    }

    const newGuess = [];
    for (var i = 0; i < state.currentGuess.length - 1; i++) {
      newGuess.push(state.currentGuess[i]);
    }

    const newState = {
      guesses: state.guesses,
      currentGuess: newGuess,
      word: state.word,
      words: state.words,
      incorrectLetters: state.incorrectLetters,
      correctLetters: state.correctLetters,
      lastDate: state.lastDate,
      stats: state.stats,
      statev: state.statev
    }

    setState(newState);
  }

  function enter() {
    var currentGuess = state.currentGuess;
    if (currentGuess.length < 5) {
      return;
    }

    var guessStr = '';
    for (var i = 0; i < currentGuess.length; i++) {
      guessStr += currentGuess[i];
    }

    var newFailed = state.stats.fail;
    const newSuccess = [];
    for (var i = 0; i < state.stats.success.length; i++) {
      newSuccess.push(state.stats.success[i]);
    }

    if (!state.words.includes(guessStr.toLowerCase())) {
      NotificationManager.info('Unfortunately that is not a word', 'Sorry!');
      return;
    }

    if (guessStr === state.word) {
      NotificationManager.success('Congratulations!', 'You got it!');
      newSuccess[state.guesses.length]++;
    }

    const newGuesses = [];
    for (var i = 0; i < state.guesses.length; i++) {
      newGuesses.push(state.guesses[i]);
    }

    newGuesses.push(currentGuess);

    if (newGuesses.length === 6 && guessStr !== state.word) {
      NotificationManager.error('The word was ' + state.word, 'You failed!');
      newFailed++;
    }

    const newState = {
      guesses: newGuesses,
      currentGuess: [],
      word: state.word,
      words: state.words,
      incorrectLetters: state.incorrectLetters,
      correctLetters: state.correctLetters,
      lastDate: state.lastDate,
      stats: {
        fail: newFailed,
        success: newSuccess
      },
      statev: state.statev
    }

    setState(newState);
  }

  if (props.enter) {
    return (
      <div className="Special" onClick={enter}>
        Enter
      </div>
    );
  }

  if (props.delete) {
    return (
      <div className="Special" onClick={del}>
        Delete
      </div>
    );
  }

  if (state.incorrectLetters.includes(props.value) && !state.correctLetters.includes(props.value)) {
    return (
      <div className="Incorrect" onClick={() => {pressKey(props.value)}}>
        {props.value}
      </div>
    );
  }

  return (
    <div className="Key" onClick={() => {pressKey(props.value)}}>
      {props.value}
    </div>
  );
}

export default Key;
