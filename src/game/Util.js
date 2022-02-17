export const colour = (letter, index, guess, word)  => {
  if (word[index] === letter) {
    return 'CORRECT';
  }

  var word_letters = String(word);
  var guess_letters = "";
  for (var g in guess) {
    guess_letters += g;
  }

  // Remove precise letters
  for (var i = 0; i < 6; i++) {
    if (word_letters[i] === guess_letters[i]) {
      word_letters = word_letters.slice(0, i) + '_' +
        word_letters.slice(i + 1, word_letters.length);
      guess_letters = guess_letters.slice(0, i) + '_' +
        guess_letters.slice(i + 1, guess_letters.length);
    }
  }

  for (var i = 0; i < index; i++) {
    const ind = word_letters.indexOf(guess[i]);
    if (ind !== -1) {
      word_letters = word_letters.slice(0, ind) +
        word_letters.slice(ind + 1, word_letters.length);
    }
  }

  const ind = word_letters.indexOf(letter);
  if (ind !== -1) {
    return 'MISS';
  }

  return 'INCORRECT';
}
