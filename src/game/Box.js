import { useContext } from 'react';
import './Box.css';
import { GameContext } from './Game';
import { colour } from './Util.js';

function Box(props) {
  const { state, setState } = useContext(GameContext);

  const puzzleInfo = state.puzzle;
  const guesses = puzzleInfo.guesses;
  const word = puzzleInfo.word;
  const currentGuess = puzzleInfo.currentGuess;
  const incorrect = puzzleInfo.letters.incorrect;
  const correct = puzzleInfo.letters.correct;

  function updateCorrectLetters(letter) {
    const newCorrectLetters = String(correct) + letter;
    const newState = {
      puzzle: {
        guesses: guesses,
        currentGuess: currentGuess,
        word: word,
        letters: {
          correct: newCorrectLetters,
          incorrect: incorrect
        }
      },
      words: state.words,
      stats: state.stats
    }

    setState(newState);
  }

  function updateIncorrectLetters(letter) {
    const newIncorrectLetters = String(incorrect) + letter;
    const newState = {
      puzzle: {
        guesses: guesses,
        currentGuess: currentGuess,
        word: word,
        letters: {
          correct: correct,
          incorrect: newIncorrectLetters
        }
      },
      words: state.words,
      stats: state.stats
    }

    setState(newState);
  }

  function match(letter, index, guess, word) {
    const col = colour(letter, index, guess, word);
    if (correct.includes(letter) || incorrect.includes(letter)) {
      return col;
    }

    if (col === 'CORRECT' || col === 'MISS') {
      updateCorrectLetters(letter);
    }

    if (col === 'INCORRECT') {
      updateIncorrectLetters(letter);
    }

    return col;
  }

  if (props.complete) {
    const result = match(props.value, props.index, props.guess, word);

    if (result === 'CORRECT') {
      return (
        <div className="Box-Correct">
          {props.value}
        </div>
      );
    }

    if (result === 'INCORRECT') {
      return (
        <div className="Box-Incorrect">
          {props.value}
        </div>
      );
    }

    if (result === 'MISS') {
      return (
        <div className="Box-Miss">
          {props.value}
        </div>
      );
    }
  }

  return (
    <div className="Box">
      {props.value}
    </div>
  );
}

export default Box;
