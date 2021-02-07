"use strict";

const path = require("path");
const {
  readAndTransformInputFile,
} = require("../helpers/readAndTransformInputFile");

const inputFilePath = path.resolve(__dirname, "./input.txt");
const rawTiles = readAndTransformInputFile(inputFilePath, "\n\n").map((tile) =>
  tile.split("\n")
);

const tileEdgeReducer = (acc, line, index, source) => {
  if (index === 0) acc.top = line;
  if (index === source.length - 1) acc.bottom = line;

  acc.left += line[0];
  acc.right += line[line.length - 1];

  return acc;
};

const getTileId = (tile) =>
  tile[0].substring(tile[0].indexOf(" ") + 1, tile.length - 2);

const getTileEdges = (tile) =>
  tile
    .slice(1)
    .reduce(tileEdgeReducer, { top: [], right: [], left: [], bottom: [] });

const createTiles = (tile) => {
  const id = getTileId(tile);
  const edges = getTileEdges(tile);
  return { id, edges };
};

const initTileCounts = (acc, tile) => {
  acc[tile.id] = 0;
  return acc;
};

const flip = (edge) => edge.split("").reverse().join("");

function findCornerTiles(tiles) {
  const tileCounts = tiles.reduce(initTileCounts, {});
  tiles.forEach((tile) => {
    Object.values(tile.edges).forEach((edge) => {
      tiles.forEach((otherTile) => {
        if (tile.id !== otherTile.id) {
          Object.values(otherTile.edges).forEach((otherEdge) => {
            const match = edge === otherEdge;
            const flipMatch = flip(edge) === otherEdge;

            if (match) tileCounts[tile.id] += 1;
            if (flipMatch) tileCounts[tile.id] += 1;
          });
        }
      });
    });
  });

  return Object.entries(tileCounts)
    .filter(([, value]) => value === 2)
    .map(([id]) => id);
}

function part1() {
  const tiles = rawTiles.map(createTiles);
  const corners = findCornerTiles(tiles);
  return corners.reduce((product, corner) => product * Number(corner), 1);
}

function part2() {
  return "NOT_IMPLEMENTED";
}

module.exports = { part1, part2 };
