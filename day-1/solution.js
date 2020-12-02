"use strict";

const path = require("path");
const utils = require("../utils");

const inputFilePath = path.resolve(__dirname, "./input.json");
const expenses = utils.readAndParseInputFile(inputFilePath);

const SUM = 2020;

const findAddendsReducer = (
  addendsAccumulator,
  currentAddend,
  currentIndex,
  sourceArray
) => {
  if (addendsAccumulator.length === 2) {
    return addendsAccumulator;
  }

  const foundAddend = sourceArray.find(
    (addend, index) => currentIndex !== index && addend + currentAddend === SUM
  );

  return foundAddend ? [currentAddend, foundAddend] : [];
};

function getSolution() {
  const addendTuple = expenses.reduce(findAddendsReducer, []);
  return addendTuple[0] * addendTuple[1];
}

module.exports = { getSolution };
