"use strict";

const path = require("path");
const {
  readAndTransformInputFile,
} = require("../helpers/readAndTransformInputFile");
const Tile = require("./Tile");

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

const tileDataReducer = (acc, line, index, source) => {
  if (index === 0 || index === source.length - 1) {
    return acc;
  }

  return [...acc, line.slice(1, line.length - 1)];
};

const getTileId = (tile) =>
  tile[0].substring(tile[0].indexOf(" ") + 1, tile.length - 2);

const getTileEdges = (tile) =>
  tile
    .slice(1)
    .reduce(tileEdgeReducer, { top: [], right: [], left: [], bottom: [] });

const getTileData = (tile) => tile.slice(1).reduce(tileDataReducer, []);

const createTiles = (tile) => {
  const id = getTileId(tile);
  const edges = getTileEdges(tile);
  const data = getTileData(tile);
  return new Tile(id, edges, data);
};

const arrangeTiles = (tiles) => {
  tiles.forEach((tile) => {
    const otherTiles = tiles.filter((otherTile) => tile.id !== otherTile.id);
    Object.entries(tile.edges).forEach(([edge, value]) => {
      let matchedTileIds = [];
      otherTiles.forEach((otherTile) => {
        if (!matchedTileIds.includes(otherTile.id)) {
          let match = false;
          let edgesChecked = 0;
          while (!match && edgesChecked <= 8) {
            if (otherTile.top === value) {
              match = true;
              matchedTileIds.push(otherTile.id);
            } else {
              otherTile.rotate();
              if (edgesChecked === 4) {
                otherTile.reset();
                otherTile.flip();
              }
              edgesChecked += 1;
            }
          }

          if (match) {
            tile.neighbors.set(edge, otherTile);
          } else {
            otherTile.reset();
          }
        }
      });
    });
  });

  return tiles;
};

const zipData = (data1, data2) =>
  data1.map((line, index) => line + data2[index]);

const traverseRight = (tile) => {
  if (!tile.neighbors.has("right")) {
    return tile.data;
  }

  return zipData(tile.data, traverseRight(tile.neighbors.get("right")));
};

const traverseTiles = (keyTile) => {
  return traverseRight(keyTile);
};

function part1() {
  const tiles = rawTiles.map(createTiles);
  arrangeTiles(tiles);
  const corners = tiles.filter((tile) => tile.neighbors.size === 2);
  return corners.reduce((product, corner) => product * Number(corner.id), 1);
}

function part2() {
  const tiles = rawTiles.map(createTiles);
  arrangeTiles(tiles);
  const keyTile = tiles.find(
    (tile) =>
      tile.neighbors.has("right") &&
      tile.neighbors.has("bottom") &&
      !tile.neighbors.has("left") &&
      !tile.neighbors.has("top")
  );

  const arrangedData = traverseTiles(keyTile);
  return arrangedData;
}

module.exports = { part1, part2 };
