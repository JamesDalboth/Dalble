import { useContext } from 'react';
import {NotificationContainer, NotificationManager} from 'react-notifications';

import './Key.css';
import { GameContext } from './Game';

function Key(props) {
  const { state, setState } = useContext(GameContext);

  const puzzleInfo = state.puzzle;
  const guesses = puzzleInfo.guesses;
  const word = puzzleInfo.word;
  const currentGuess = puzzleInfo.currentGuess;
  const incorrect = puzzleInfo.letters.incorrect;
  const correct = puzzleInfo.letters.correct;

  function pressKey(key) {
    if (currentGuess.length === 5) {
      return;
    }

    const newState = {
      puzzle: {
        guesses: guesses,
        currentGuess: [...currentGuess, key],
        word: word,
        letters: puzzleInfo.letters
      },
      words: state.words,
      stats: state.stats
    }

    setState(newState);
  }

  function del() {
    if (currentGuess.length === 0) {
      return;
    }

    const newGuess = [];
    for (var i = 0; i < currentGuess.length - 1; i++) {
      newGuess.push(currentGuess[i]);
    }

    const newState = {
      puzzle: {
        guesses: guesses,
        currentGuess: newGuess,
        word: word,
        letters: puzzleInfo.letters
      },
      words: state.words,
      stats: state.stats
    }

    setState(newState);
  }

  function enter() {
    if (currentGuess.length < 5) {
      return;
    }

    var guessStr = '';
    for (var i = 0; i < currentGuess.length; i++) {
      guessStr += currentGuess[i];
    }

    var newFailed = state.stats.fail;
    var newSuccess = [];

    for (var i = 0; i < 6; i++) {
      newSuccess.push(state.stats.success[i]);
    }

    if (!state.words.guesses.includes(guessStr.toLowerCase()) &&
        !state.words.answers.includes(guessStr.toLowerCase())) {
      console.log(guessStr.toLowerCase());
      console.log(state.words.answers.includes(guessStr.toLowerCase()));
      NotificationManager.info('Unfortunately that is not a word', 'Sorry!');
      return;
    }

    if (guessStr === word) {
      NotificationManager.success('Congratulations!', 'You got it!');
      newSuccess[guesses.length]++;
    }

    const newGuesses = [];
    for (var i = 0; i < guesses.length; i++) {
      newGuesses.push(guesses[i]);
    }

    newGuesses.push(currentGuess);

    if (newGuesses.length === 6 && guessStr !== word) {
      NotificationManager.error('The word was ' + word, 'You failed!');
      newFailed++;
    }

    const newState = {
      puzzle: {
        guesses: newGuesses,
        currentGuess: [],
        word: word,
        letters: puzzleInfo.letters
      },
      words: state.words,
      stats: {
        lastDate: state.stats.lastDate,
        fail: newFailed,
        success: newSuccess
      },
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

  if (incorrect.includes(props.value) && !correct.includes(props.value)) {
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
