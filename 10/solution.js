"use strict";

const path = require("path");
const {
  readAndTransformInputFile,
} = require("../helpers/readAndTransformInputFile");

const inputFilePath = path.resolve(__dirname, "./input.txt");
let adapters = readAndTransformInputFile(inputFilePath)
  .map(Number)
  .sort((a, b) => a - b);
// Add the outlet and device to the chain
adapters = [0, ...adapters, adapters[Math.max(...adapters.keys())] + 3];

const adapterChainReducer = (adapterChainCounts, currentAdapter) => {
  const adapterChainCountReducer = (adapterChainCount, nextAdaptor) =>
    Object.assign({}, adapterChainCount, {
      [nextAdaptor]:
        (adapterChainCounts[nextAdaptor] || 0) +
        (adapterChainCounts[currentAdapter] || 1),
    });

  const validAdapterFilter = (adapterOption) =>
    adapterOption !== currentAdapter &&
    adapterOption <= currentAdapter + 3 &&
    adapterOption > currentAdapter;

  const nextAdaptors = adapters.filter(validAdapterFilter);
  const updatedChainCounts = nextAdaptors.reduce(adapterChainCountReducer, {});

  return Object.assign({}, adapterChainCounts, updatedChainCounts);
};

function part1() {
  let diffs = {
    1: 1,
    2: 0,
    3: 1,
  };
  for (let i = 0; i < adapters.length; i += 1) {
    const difference = adapters[i + 1] - adapters[i];
    diffs[difference] += 1;
  }
  return diffs[1] * diffs[3];
}

function part2() {
  return adapters.reduce(adapterChainReducer, { 0: 1 })[
    adapters[Math.max(...adapters.keys())]
  ];
}

module.exports = { part1, part2 };
