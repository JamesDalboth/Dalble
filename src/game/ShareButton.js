import { useContext } from 'react';
import './Share.css';
import { NotificationManager } from 'react-notifications';
import { colour } from './Util.js';
import { GameContext } from './Game';

const handleOnClick = (guesses, word, date) => {
  const head = 'Dalble ' + date + ' ';
  var body = '';

  var solved = false;

  for (const guess of guesses) {
    var correctGuess = true;
    for (var i = 0; i < 5; i++) {
      const col = colour(guess[i], i, guess, word);
      if (col === 'CORRECT') {
        body += '🟩';
      } else if (col === 'INCORRECT') {
        body += '⬛';
        correctGuess = false;
      } else {
        body += '🟨';
        correctGuess = false;
      }
    }
    solved = solved || correctGuess;
    body += '\n';
  }

  if (solved) {
    head = head + guesses.length;
  } else {
    head = head + "X";
  }

  const res = head + '/6\n' + body;

  if ('clipboard' in navigator && window.isSecureContext) {
    navigator.clipboard.writeText(res);
  } else {
    console.log("Backup copy");
    let textArea = document.createElement("textarea");
    textArea.value = res;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.right = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand('copy');
    textArea.remove();
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
