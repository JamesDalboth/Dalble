import { useContext } from 'react';
import './Share.css';
import { NotificationManager } from 'react-notifications';
import { accuracy, CORRECT, INCORRECT, MISS } from './util/accuracy.js';
import { GUESS_SIZE } from './util/consts.js';
import { GameContext } from './Game';

const GREEN_SQUARE = '🟩';
const BLACK_SQUARE = '⬛';
const YELLOW_SQUARE = '🟨';

/**
    Copies text to the clipboard, using the clipboard tool if it exists or a backup method if not.
**/
const copyToClipboard = (text) => {
  if ('clipboard' in navigator && window.isSecureContext) {
    navigator.clipboard.writeText(text);
  } else {
    let textArea = document.createElement("textarea");
    textArea.value = text;
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
}

/**
  For a given set of guesses, word and date.
  Generate spoiler free text that can be shared with friends.

  e.g.
  Dalble 09/02/2023 3/6
  ⬛⬛⬛⬛⬛
  🟨⬛⬛⬛⬛
  🟩🟩🟩🟩🟩
**/
const handleOnClick = (guesses, word, date) => {
  const head = 'Dalble ' + date + ' ';
  var body = '';

  var solved = false;

  for (const guess of guesses) {
    var correctGuess = true;
    for (var i = 0; i < GUESS_SIZE; i++) {
      const acc = accuracy(i, guess, word);
      if (acc === CORRECT) {
        body += GREEN_SQUARE;
      } else if (acc === INCORRECT) {
        body += BLACK_SQUARE;
        correctGuess = false;
      } else if (acc === MISS) {
        body += YELLOW_SQUARE;
        correctGuess = false;
      }
    }
    solved = solved || correctGuess;
    body += '\n';
  }

  var noGuessesTillSuccess = "X";
  if (solved) {
    noGuessesTillSuccess = guesses.length;
  }
  noGuessesTillSuccess = noGuessesTillSuccess + '/6'

  const res = head + noGuessesTillSuccess + '\n' + body;
  copyToClipboard(res);
};

/**
  Generates the share button.
  When clicked copies text to the clipboard which contains spoiler free guess info.
**/
function ShareButton() {
  const { state } = useContext(GameContext);

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
