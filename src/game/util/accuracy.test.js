import "@testing-library/jest-dom";

import { accuracy, CORRECT, INCORRECT, MISS, GUESS_SIZE } from './accuracy.js';

describe("Testing Accuracy", () => {
  it.each([
      [0, "JUDGE", "JUDGE", CORRECT],
      [1, "JUDGE", "JUDGE", CORRECT],
      [2, "JUDGE", "JUDGE", CORRECT],
      [3, "JUDGE", "JUDGE", CORRECT],
      [4, "JUDGE", "JUDGE", CORRECT],
      [0, "JELLY", "JUDGE", CORRECT],
      [1, "FUDGE", "JUDGE", CORRECT],
      [2, "FUDGE", "JUDGE", CORRECT],
      [3, "FUDGE", "JUDGE", CORRECT],
      [4, "FUDGE", "JUDGE", CORRECT],
      [0, "UDDER", "JUDGE", MISS],
      [0, "DEATH", "JUDGE", MISS],
      [0, "GREAT", "JUDGE", MISS],
      [0, "EARTH", "JUDGE", MISS],
      [0, "ROOMS", "SORRY", MISS],
      [2, "FIRST", "SORRY", CORRECT],
      [0, "RRRRR", "SORRY", INCORRECT],
      [1, "RRRRR", "SORRY", INCORRECT],
      [2, "RRRRR", "SORRY", CORRECT],
      [3, "RRRRR", "SORRY", CORRECT],
      [4, "RRRRR", "SORRY", INCORRECT],
      [4, "AARAR", "SORRY", MISS],
      [4, "AAARR", "SORRY", MISS],
      [0, "RARAA", "SORRY", MISS],
      [0, "RAARA", "SORRY", MISS],
      [4, "RAARR", "SORRY", INCORRECT],
      [0, "RRAAR", "SORRY", MISS],
      [0, "RRAAR", "SORRY", MISS],
      [1, "RRAAR", "SORRY", MISS],
      [4, "RRAAR", "SORRY", INCORRECT],
      [3, "TRUSS", "SORRY", MISS],
      [4, "TRUSS", "SORRY", INCORRECT],
  ])('Letter %s index %p guess %s word %s should be %s', (index, guess, word, expected) => {
    const result = accuracy(index, guess, word);
    expect(result).toBe(expected);
  });
});

