import './Stats.css';
import { useContext } from 'react';
import { GameContext } from './Game';

function Stats() {
  const { state, setState } = useContext(GameContext);

  return (
    <div className="Stats">
      {}
    </div>
  );
}

export default Stats;
