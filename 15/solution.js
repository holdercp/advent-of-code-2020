"use strict";

const path = require("path");
const {
  readAndTransformInputFile,
} = require("../helpers/readAndTransformInputFile");

const inputFilePath = path.resolve(__dirname, "./input.txt");
const startingNumbers = readAndTransformInputFile(inputFilePath, ",").map(
  Number
);

function play(rounds) {
  const startingLength = startingNumbers.length;
  const pastNumbers = new Map();

  let lastSpoken = 0;

  startingNumbers.forEach((number, index) => {
    pastNumbers.set(number, index + 1);
  });

  for (let round = startingLength + 2; round <= rounds; round += 1) {
    const prevRound = round - 1;

    if (pastNumbers.has(lastSpoken)) {
      const age = prevRound - pastNumbers.get(lastSpoken);
      pastNumbers.set(lastSpoken, prevRound);
      lastSpoken = age;
    } else {
      if (lastSpoken !== 0) {
        pastNumbers.set(lastSpoken, prevRound);
      }
      lastSpoken = 0;
    }
  }

  return lastSpoken;
}

function part1() {
  return play(2020);
}

function part2() {
  return play(30000000);
}

module.exports = { part1, part2 };
