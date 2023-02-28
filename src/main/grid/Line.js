import './Line.css';
import Box from './Box'
import { GUESS_SIZE } from '../util/consts.js';

/**
  Generates a guess line. There are 3 cases.
  1. A non-active line below the current guess. e.g blank boxes.
  2. A non-active line above a current guess. e.g. the guess for that line coloured accordingly.
  3. The guess could be full but not submitted. e.g. not complete so not coloured
     Or the guess is even incomplete so some letters not inputted.
**/
function Line(props) {
  const rows = [];

  for (let i = 0; i < GUESS_SIZE; i++) {
    if (props.guess != null) {
      rows.push(<Box key={i} value={props.guess[i]} index={i} guess={props.guess} complete={props.complete}/>)
    } else {
      rows.push(<Box key={i}/>)
    }
  }

  return (
    <div className="Line">
      {rows}
    </div>
  );
}

export default Line;
