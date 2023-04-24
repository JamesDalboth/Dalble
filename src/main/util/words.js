const shuffleSeed = require('shuffle-seed');

const baseDate = new Date('2022-09-19');
const seed = "JamesD"

export const pick = (words, date)  => {
    const index = daysBetween(date, baseDate) % words.length;

    const shuffled = shuffleSeed.shuffle(words, seed);

    return shuffled[index];
}

const daysBetween = (date1, date2) => {
    return Math.floor((date1 - date2) / (1000 * 60 * 60 * 24));
}
