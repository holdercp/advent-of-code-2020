"use strict";

const path = require("path");
const {
  readAndTransformInputFile,
} = require("../helpers/readAndTransformInputFile");

const inputFilePath = path.resolve(__dirname, "./input.txt");
const data = readAndTransformInputFile(inputFilePath).map((digit) =>
  parseInt(digit, 10)
);

const numIsValid = (addends, sum) => {
  for (let i = 0; i < addends.length - 1; i += 1) {
    const addend1 = addends[i];
    for (let j = i + 1; j < addends.length; j += 1) {
      const addend2 = addends[j];
      if (addend1 + addend2 === sum) {
        return true;
      }
    }
  }
  return false;
};

const sumReducer = (sum, addend) => sum + addend;

const findAddends = (addends, targetSum) => {
  let addendsToSum = [];
  let currentIndex = 0;
  do {
    const sum = addendsToSum.reduce(sumReducer, 0);
    if (sum === targetSum) {
      return addendsToSum;
    }

    if (currentIndex < addends.length) {
      const currentAddend = addends[currentIndex];
      if (sum + currentAddend > targetSum) {
        addendsToSum.shift();
      }

      addendsToSum.push(currentAddend);
    } else {
      addendsToSum.shift();
    }

    currentIndex += 1;
  } while (addendsToSum.length > 0);

  return addendsToSum;
};

function part1() {
  const preambleLength = 25;
  const rest = data.slice(preambleLength);

  for (let i = 0; i < rest.length; i += 1) {
    const addends = data.slice(i, preambleLength + i);

    if (!numIsValid(addends, rest[i])) {
      return rest[i];
    }
  }

  return null;
}

function part2() {
  const invalidSum = part1();
  for (let i = 0; i < data.length; i += 1) {
    const validAddends = findAddends(data.slice(i), invalidSum);
    if (validAddends.length > 0) {
      validAddends.sort((a, b) => a - b);
      return validAddends[0] + validAddends[validAddends.length - 1];
    }
  }

  return "I hate my life";
}

module.exports = { part1, part2 };
