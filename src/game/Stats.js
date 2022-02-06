import './Stats.css';
import { useContext } from 'react';
import { GameContext } from './Game';
import Countdown from 'react-countdown';

function Stats() {
  const { state, setState } = useContext(GameContext);

  function percentageCorrect() {
    var totalCorrect = 0;

    for (var i = 0; i < state.stats.success.length; i++) {
      totalCorrect += state.stats.success[i];
    }

    const percCorrect = totalCorrect * 100 / (totalCorrect + state.stats.fail);
    return percCorrect;
  }

  var d = new Date();
  d.setHours(24,0,0,0);

  const renderer = ({ hours, minutes, seconds, completed }) => {
    return <span>{hours}h:{minutes}m:{seconds}s</span>;
  };

  return (
    <div className="Stats">
      <div>{percentageCorrect() + "% Correct"}</div>
      <div><Countdown date={d} renderer={renderer}/> {" left until next puzzle!"}</div>
    </div>
  );
}

export default Stats;
