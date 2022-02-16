import { useContext } from 'react';
import './Share.css';
import { NotificationManager } from 'react-notifications';
import { colour } from './Util.js';
import { GameContext } from './Game';

const handleOnClick = (guesses, word, date) => {
  var res = 'Dalble ' + date + ' ' + guesses.length + '/6\n';

  for (const guess of guesses) {
    for (var i = 0; i < 5; i++) {
      const col = colour(guess[i], i, guess, word);
      if (col === 'CORRECT') {
        res += '🟩';
      } else if (col === 'INCORRECT') {
        res += '⬛';
      } else {
        res += '🟨';
      }
    }
    res += '\n';
  }

  if ('clipboard' in navigator && window.isSecureContext) {
    navigator.clipboard.writeText(res);
  } else {
    document.execCommand('copy', true, res);
  }

  NotificationManager.info('Results copied to clipboard!', 'Share with friends!');
};

function ShareButton() {
  const { state, setState } = useContext(GameContext);

  const puzzleInfo = state.puzzle;
  const guesses = puzzleInfo.guesses;
  const word = puzzleInfo.word;
  const date = state.stats.lastDate;

  return (
    <div className="Share" onClick={() => {handleOnClick(guesses, word, date);}}>
      Share Dalble Results!
    </div>
  );
}

export default ShareButton;
