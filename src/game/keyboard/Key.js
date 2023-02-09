import { useContext } from 'react';
import { NotificationManager } from 'react-notifications';

import './Key.css';
import { GameContext } from '../Game';
import { GUESS_SIZE, MAX_NO_GUESSES } from '../util/consts.js';

/// Process delete key press.
function del(state, setState) {
  const newState = {...state}
  if (state.puzzle.currentGuess.length === 0) {
    return;
  }

  newState.puzzle.currentGuess.pop();
  setState(newState);
}

/// Process a key press.
function pressKey(key, state, setState) {
  const newState = {...state}

  // No more space in guess. Don't do anything.
  if (state.puzzle.currentGuess.length === GUESS_SIZE) {
    return;
  }

  newState.puzzle.currentGuess.push(key);
  setState(newState);
}

/// Process enter key press.
function enter(state, setState) {
  const newState = {...state}

  const word = state.puzzle.word;
  const guesses = state.puzzle.guesses;

  // Can't enter, guess not complete.
  if (state.puzzle.currentGuess.length < GUESS_SIZE) {
    return;
  }

  const currentGuessStr = state.puzzle.currentGuess.join('').toLowerCase();

  // Check if guess is in list of guesses / answers. If not can't submit
  // Note: not confirmed if answers is subset of guesses.
  if (!state.words.guesses.includes(currentGuessStr) &&
      !state.words.answers.includes(currentGuessStr)) {
    NotificationManager.info('Unfortunately that is not a word', 'Sorry!');
    return;
  }

  // If guess is correct.
  if (currentGuessStr === word.toLowerCase()) {
    NotificationManager.success('Congratulations!', 'You got it!');
    newState.stats.success[guesses.length]++;
  }

  // Update guesses.
  newState.puzzle.guesses.push(state.puzzle.currentGuess);

  // If we have reached maximum number of guesses and not found the word.
  if (newState.puzzle.guesses.length === MAX_NO_GUESSES &&
      currentGuessStr !== word.toLowerCase()) {
    NotificationManager.error('The word was ' + word, 'You failed!');
    newState.stats.fail++;
  }

  newState.puzzle.currentGuess = [];
  setState(newState);
}

/**
  Render key depending on props. 3 cases. Enter, Delete or Normal Key.
**/
function Key(props) {
  const { state, setState } = useContext(GameContext);

  const puzzleInfo = state.puzzle;
  const incorrect = puzzleInfo.letters.incorrect;
  const correct = puzzleInfo.letters.correct;

  // Render enter key.
  if (props.enter) {
    return (
      <div className="Special" onClick={() => enter(state, setState)}>
        Enter
      </div>
    );
  }

  // Render delete key.
  if (props.delete) {
    return (
      <div className="Special" onClick={() => {del(state, setState)}}>
        Delete
      </div>
    );
  }

  // Render key for letter we know is incorrect.
  if (incorrect.includes(props.value) && !correct.includes(props.value)) {
    return (
      <div className="Incorrect" onClick={() => {pressKey(props.value, state, setState)}}>
        {props.value}
      </div>
    );
  }

  // Render key
  return (
    <div className="Key" onClick={() => {pressKey(props.value, state, setState)}}>
      {props.value}
    </div>
  );
}

export default Key;
