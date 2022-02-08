import { useContext } from 'react';
import './Box.css';
import { GameContext } from './Game';

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

  function match() {
    if (word[props.index] === props.value) {
      if (!correct.includes(props.value)) {
        updateCorrectLetters(props.value);
      }

      return 'CORRECT';
    }

    var letters = String(word);

    // Remove precise letters
    for (var i = 0; i < 6; i++) {
      if (word[i] === props.guess[i]) {
        letters = letters.slice(0, i) + '_' + letters.slice(i + 1, letters.length);
      }
    }

    for (var i = 0; i < props.index; i++) {
      const ind = letters.indexOf(props.guess[i]);
      if (ind !== -1) {
        letters = letters.slice(0, ind) + letters.slice(ind + 1, letters.length);
      }
    }

    const ind = letters.indexOf(props.value);
    if (ind !== -1) {
      if (!correct.includes(props.value)) {
        updateCorrectLetters(props.value);
      }

      return 'MISS';
    }

    if (!incorrect.includes(props.value)) {
      updateIncorrectLetters(props.value);
    }

    return 'INCORRECT';
  }

  if (props.complete) {
    const result = match();

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
