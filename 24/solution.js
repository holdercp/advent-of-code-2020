"use strict";

const path = require("path");
const {
  readAndTransformInputFile,
} = require("../helpers/readAndTransformInputFile");

const inputFilePath = path.resolve(__dirname, "./input.txt");

const getDirections = (line) => {
  let directions = [];
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === "e" || char === "w") {
      directions.push(char);
    } else {
      directions.push(`${char}${nextChar}`);
      i += 1;
    }
  }
  return directions;
};

const list = readAndTransformInputFile(inputFilePath).map(getDirections);

const move = (direction, [x, y]) => {
  if (direction === "e") return [x + 2, y];
  if (direction === "w") return [x - 2, y];

  if (direction === "ne") return [x + 1, y - 1];
  if (direction === "nw") return [x - 1, y - 1];

  if (direction === "se") return [x + 1, y + 1];
  if (direction === "sw") return [x - 1, y + 1];

  throw new Error("Invalid direction passed to move");
};

const followDirections = (position, direction) => move(direction, position);

function part1() {
  const blackTiles = new Set();

  list.forEach((directions) => {
    const position = directions.reduce(followDirections, [0, 0]);
    const tile = position.join(".");

    if (blackTiles.has(tile)) {
      blackTiles.delete(tile);
    } else {
      blackTiles.add(tile);
    }
  });

  return blackTiles.size;
}

function part2() {
  return "NOT_IMPLEMENTED";
}

module.exports = { part1, part2 };
