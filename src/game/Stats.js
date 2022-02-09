import './Stats.css';
import { useContext } from 'react';
import { GameContext } from './Game';
import Countdown from 'react-countdown';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Stats() {
  const { state, setState } = useContext(GameContext);

  var totalCorrect = 0;

  for (var i = 0; i < state.stats.success.length; i++) {
    totalCorrect += state.stats.success[i];
  }

  const percCorrect = totalCorrect * 100 / (totalCorrect + state.stats.fail);

  var d = new Date();
  d.setHours(24,0,0,0);

  const renderer = ({ hours, minutes, seconds, completed }) => {
    return <span>{hours}h:{minutes}m:{seconds}s</span>;
  };

  const labels = [1, 2, 3, 4, 5, 6];

  const data = {
    labels,
    datasets: [
      {
        data: state.stats.success,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ],
  };

  const barOptions = {
    title: {
      display: true,
      text: 'How many attempts at success?',
    },
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true
      }
    }
  };

  return (
    <div className="Stats">
      <div className="Count"><Countdown date={d} renderer={renderer}/> {" NEXT DALBLE || LAST WORD WAS " + state.puzzle.word}</div>
      <hr/>
      <div className="Perc">{"WIN % - " + percCorrect + " || TOTAL PLAYED - " + (totalCorrect + state.stats.fail)}</div>
      <hr/>
      <div className="BarTitle">GUESS DISTRIBUTION</div>
      <div className="Bar"><Bar data={data} options={barOptions}/></div>
    </div>
  );
}

export default Stats;
