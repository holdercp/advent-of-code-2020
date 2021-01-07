"use strict";

const path = require("path");
const {
  readAndTransformInputFile,
} = require("../helpers/readAndTransformInputFile");
const Tile = require("./Tile");

const inputFilePath = path.resolve(__dirname, "./input.txt");

const getInstructions = (line) => {
  let instructions = [];
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === "e" || char === "w") {
      instructions.push(char);
    } else {
      instructions.push(`${char}${nextChar}`);
      i += 1;
    }
  }
  return instructions;
};

const instructionsList = readAndTransformInputFile(inputFilePath).map(
  getInstructions
);

const move = (instruction, [x, y]) => {
  if (instruction === "e") return [x + 2, y];
  if (instruction === "w") return [x - 2, y];

  if (instruction === "ne") return [x + 1, y - 1];
  if (instruction === "nw") return [x - 1, y - 1];

  if (instruction === "se") return [x + 1, y + 1];
  if (instruction === "sw") return [x - 1, y + 1];

  throw new Error("Invalid instruction passed to move");
};

const followInstructions = (position, instruction) =>
  move(instruction, position);

const idToPosition = (id) => id.split(".").map(Number);
const shouldFlipWhite = ([, count]) => count === 0 || count > 2;
const shouldFlipBlack = ([, count]) => count === 2;
const getId = ([id]) => id;

const flipTiles = () => {
  const blackTiles = new Map();

  instructionsList.forEach((instructions) => {
    const position = instructions.reduce(followInstructions, [0, 0]);
    const tile = new Tile(position);

    if (blackTiles.has(tile.id)) {
      blackTiles.delete(tile.id);
    } else {
      blackTiles.set(tile.id, tile);
    }
  });

  return blackTiles;
};

function part1() {
  return flipTiles().size;
}

function part2() {
  const blackTiles = flipTiles();
  const days = 100;

  for (let day = 1; day <= days; day += 1) {
    const neighbors = { black: {}, white: {} };
    blackTiles.forEach((tile) => {
      neighbors.black[tile.id] = 0;

      tile.adjacentPositions.forEach((position) => {
        const neighbor = new Tile(position);
        if (blackTiles.has(neighbor.id)) {
          neighbors.black[tile.id] += 1;
        } else {
          neighbors.white[neighbor.id] =
            (neighbors.white[neighbor.id] || 0) + 1;
        }
      });
    });

    const flipWhiteQueue = Object.entries(neighbors.black)
      .filter(shouldFlipWhite)
      .map(getId);
    const flipBlackQueue = Object.entries(neighbors.white)
      .filter(shouldFlipBlack)
      .map(getId);

    flipWhiteQueue.forEach((id) => {
      blackTiles.delete(id);
    });
    flipBlackQueue.forEach((id) => {
      blackTiles.set(id, new Tile(idToPosition(id)));
    });
  }

  return blackTiles.size;
}

module.exports = { part1, part2 };
