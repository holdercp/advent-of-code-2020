"use strict";

const path = require("path");
const {
  readAndTransformInputFile,
} = require("../helpers/readAndTransformInputFile");

const inputFilePath = path.resolve(__dirname, "./input.txt");
const map = readAndTransformInputFile(inputFilePath);

const grid = map.map((line) => line.split(""));
const gridXMax = grid[0].length;
const TREE = "#";

function countTreesOnSlope(right = 0, down = 0) {
  let treesHit = 0;
  let x = right;

  for (let y = down; y < grid.length; y += down) {
    if (x >= gridXMax) {
      x -= gridXMax;
    }

    if (grid[y][x] === TREE) {
      treesHit += 1;
    }

    x += right;
  }

  return treesHit;
}

const hitTreesProductReducer = (product, slope) => {
  const treesHit = countTreesOnSlope(...slope);
  return product * treesHit;
};

function getSolution(part = "1") {
  if (part === "2") {
    const slopes = [
      [1, 1],
      [3, 1],
      [5, 1],
      [7, 1],
      [1, 2],
    ];
    return slopes.reduce(hitTreesProductReducer, 1);
  }

  return countTreesOnSlope(3, 1);
}

module.exports = { getSolution };
