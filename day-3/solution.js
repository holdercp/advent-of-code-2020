"use strict";

const path = require("path");
const {
  readAndTransformInputFile,
} = require("../utils/readAndTransformInputFile");

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

function getSolution(part = "1") {
  return countTreesOnSlope(3, 1);
}

module.exports = { getSolution };
