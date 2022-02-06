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
      lastDate: state.lastDate
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
      lastDate: state.lastDate
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

    if (!state.words.includes(guessStr.toLowerCase())) {
      NotificationManager.info('Unfortunately that is not a word', 'Sorry!');
      return;
    }

    if (guessStr === state.word) {
      NotificationManager.success('Congratulations!', 'You got it!');
    }

    const newGuesses = [];
    for (var i = 0; i < state.guesses.length; i++) {
      newGuesses.push(state.guesses[i]);
    }

    newGuesses.push(currentGuess);

    const newState = {
      guesses: newGuesses,
      currentGuess: [],
      word: state.word,
      words: state.words,
      incorrectLetters: state.incorrectLetters,
      correctLetters: state.correctLetters,
      lastDate: state.lastDate
    }

    setState(newState);

    if (newState.guesses.length === 6) {
      NotificationManager.error('The word was ' + state.word, 'You failed!');
    }
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
