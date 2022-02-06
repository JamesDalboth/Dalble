import './Stats.css';
import { useContext } from 'react';
import { GameContext } from './Game';

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

  return (
    <div className="Stats">
      {percentageCorrect() + "% Correct"}
    </div>
  );
}

export default Stats;
