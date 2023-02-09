import { useContext } from 'react';
import './Box.css';
import { GameContext } from '../Game';
import { accuracy, CORRECT, INCORRECT, MISS } from '../util/accuracy.js';

/// Adapter for accuracy method which also updates correct / incorrect state.
function match(letter, index, guess, state, setState) {
  const incorrect = state.puzzle.letters.incorrect;
  const correct = state.puzzle.letters.correct;
  const word = state.puzzle.word

  const col = accuracy(index, guess, word);
  if (correct.includes(letter) || incorrect.includes(letter)) {
    return col;
  }

  if (col === CORRECT || col === MISS) {
    state.puzzle.letters.correct += letter;
    setState(state);
  }

  if (col === INCORRECT) {
    state.puzzle.letters.incorrect += letter;
    setState(state);
  }

  return col;
}

/**
  Generates the letter box. There are 4 cases.
  1. The letter is submitted and correct, use Box-Correct css.
  2. The letter is submitted and incorrect, use Box-Incorrect css.
  3. The letter is submitted and a miss, use Box-Miss css.
  4. The letter is not submitted, use Box css.
**/
function Box(props) {
  const { state, setState } = useContext(GameContext);

  var className = "Box";

  if (props.complete) {
    const result = match(props.value, props.index, props.guess, state, setState);

    if (result === CORRECT) {
      className += "-Correct";
    }

    if (result === INCORRECT) {
      className += "-Incorrect";
    }

    if (result === MISS) {
      className += "-Miss";
    }
  }

  return (
    <div className={className}>
      {props.value}
    </div>
  );
}

export default Box;
