"use strict";

const path = require("path");
const {
  readAndTransformInputFile,
} = require("../utils/readAndTransformInputFile");

const inputFilePath = path.resolve(__dirname, "./input.txt");
const expenses = readAndTransformInputFile(inputFilePath)
  .map((expense) => parseInt(expense, 10))
  .sort((a, b) => a - b);

const SUM = 2020;

const sumReducer = (sum, num) => sum + num;
const multiplyReducer = (product, num) => product * num;

function findAddends(sum, addends, numOfAddends, prevAddends = []) {
  if (addends.length === 0) {
    return addends;
  }

  const [currentAddend, ...remainingAddends] = addends;
  const prevAddendsSum = prevAddends.reduce(sumReducer, 0);

  for (let i = 0; i < remainingAddends.length; i += 1) {
    if (numOfAddends > 2) {
      const recursiveAddends = findAddends(
        sum,
        remainingAddends,
        numOfAddends - 1,
        [...prevAddends, currentAddend]
      );
      if (recursiveAddends.length > 0) {
        return recursiveAddends;
      }
      break;
    }

    const nextAddend = remainingAddends[i];
    if (prevAddendsSum + currentAddend + nextAddend === sum) {
      return [...prevAddends, currentAddend, nextAddend];
    }

    if (prevAddendsSum + currentAddend + nextAddend > sum) {
      break;
    }
  }

  return findAddends(sum, remainingAddends, numOfAddends, prevAddends);
}

function getSolution(part = "1") {
  const numOfAddends = part === "2" ? 3 : 2;
  const addends = findAddends(SUM, expenses, numOfAddends);
  return addends.length > 0
    ? addends.reduce(multiplyReducer, 1)
    : `There is no sum of ${numOfAddends} expenses that equal ${SUM}`;
}

module.exports = { getSolution };
