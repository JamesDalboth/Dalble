import { GUESS_SIZE } from './consts.js';

export const CORRECT = 'CORRECT';
export const INCORRECT = 'INCORRECT';
export const MISS = 'MISS';

const replaceAt = (str, index, replacement) => {
    return str.slice(0, index) + replacement + str.slice(index + 1, str.length)
}

export const accuracy = (index, guess, word)  => {
  const letter = guess[index];

  // If letter matches directly it's simply correct.
  if (word[index] === letter) {
    return CORRECT;
  }

  // Remove precise letters
  for (let i = 0; i < GUESS_SIZE; i++) {
    if (word[i] === guess[i]) {
      word = replaceAt(word, i, '_');
      guess = replaceAt(guess, i, '_');
    }
  }

  // Where there are multiple misses for the same letter, only the first n are miss, rest are incorrect.
  for (let i = 0; i < index; i++) {
    const hitIndex = word.indexOf(guess[i]);
    if (hitIndex !== -1) {
      word = replaceAt(word, hitIndex, '_');;
    }
  }

  const ind = word.indexOf(letter);
  if (ind !== -1) {
    return MISS;
  }

  return INCORRECT;
}
