import { useContext } from 'react';
import './Box.css';
import { GameContext } from './Game';

function Box(props) {
  const { state, setState } = useContext(GameContext);

  function match() {
    if (state.word[props.index] === props.value) {
      if (!state.correctLetters.includes(props.value)) {
        const newCorrectLetters = String(state.correctLetters) + props.value;
        const newState = {
          guesses: state.guesses,
          currentGuess: state.currentGuess,
          word: state.word,
          incorrectLetters: state.incorrectLetters,
          correctLetters: newCorrectLetters
        }

        setState(newState);
      }

      return 'CORRECT';
    }

    var word = String(state.word);

    console.log(props.index);

    for (var i = 0; i < 6; i++) {
      if (state.word[i] === props.guess[i]) {
        word = word.slice(0, i) + '_' + word.slice(i + 1, word.length);
      }
    }

    for (var i = 0; i < props.index; i++) {
      const ind = word.indexOf(props.guess[i]);
      if (ind !== -1) {
        word = word.slice(0, ind) + word.slice(ind + 1, word.length);
      }
    }

    const ind = word.indexOf(props.value);
    if (ind !== -1) {
      if (!state.correctLetters.includes(props.value)) {
        const newCorrectLetters = String(state.correctLetters) + props.value;
        const newState = {
          guesses: state.guesses,
          currentGuess: state.currentGuess,
          word: state.word,
          incorrectLetters: state.incorrectLetters,
          correctLetters: newCorrectLetters
        }

        setState(newState);
      }

      return 'MISS';
    }


    if (!state.incorrectLetters.includes(props.value)) {
      const newIncorrectLetters = String(state.incorrectLetters) + props.value;
      const newState = {
        guesses: state.guesses,
        currentGuess: state.currentGuess,
        word: state.word,
        words: state.words,
        incorrectLetters: newIncorrectLetters,
        correctLetters: state.correctLetters
      }

      setState(newState);
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
