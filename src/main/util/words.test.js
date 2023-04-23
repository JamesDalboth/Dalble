import "@testing-library/jest-dom";

import { pick } from './words.js';

const testWords = ['word1', 'word2', 'word3', 'word4'];

describe("Testing pick", () => {
    test('Is consistent', () => {
        const d = new Date('2023-09-19');

        const w1 = pick(testWords, d);
        const w2 = pick(testWords, d);

        expect(w2).toBe(w1);
    });
    test('Consecutive dates pick different words', () => {
        const d1 = new Date('2023-09-19');
        const d2 = new Date('2023-09-20');
        const d3 = new Date('2023-09-21');
        const d4 = new Date('2023-09-22');

        const w1 = pick(testWords, d1);
        const w2 = pick(testWords, d2);
        const w3 = pick(testWords, d3);
        const w4 = pick(testWords, d4);

        expect(w1).not.toEqual(w2);
        expect(w1).not.toEqual(w3);
        expect(w1).not.toEqual(w4);
        expect(w2).not.toEqual(w3);
        expect(w2).not.toEqual(w4);
        expect(w3).not.toEqual(w4);
    });
    test('2nd Loop is same order', () => {
        const d11 = new Date('2023-09-19');
        const d21 = new Date('2023-09-20');
        const d31 = new Date('2023-09-21');
        const d41 = new Date('2023-09-22');

        const w11 = pick(testWords, d11);
        const w21 = pick(testWords, d21);
        const w31 = pick(testWords, d31);
        const w41 = pick(testWords, d41);

        const d12 = new Date('2023-09-23');
        const d22 = new Date('2023-09-24');
        const d32 = new Date('2023-09-25');
        const d42 = new Date('2023-09-26');

        const w12 = pick(testWords, d12);
        const w22 = pick(testWords, d22);
        const w32 = pick(testWords, d32);
        const w42 = pick(testWords, d42);

        expect(w11).toEqual(w12);
        expect(w21).toEqual(w22);
        expect(w31).toEqual(w32);
        expect(w41).toEqual(w42);
    });
});

