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

const search = (
  tile,
  candidates,
  matched,
  tiles,
  cb,
  [tileEdge, candidateEdge]
) => {
  candidates.forEach((candidate) => {
    if (!matched.includes(candidate.id)) {
      let match = false;
      let edgesChecked = 0;
      while (!match && edgesChecked <= 8) {
        if (tile[tileEdge] === candidate[candidateEdge]) {
          match = true;
          matched.push(candidate.id);
        } else {
          candidate.rotate();
          if (edgesChecked === 4) {
            candidate.reset();
            candidate.flip();
          }
          edgesChecked += 1;
        }
      }

      if (match) {
        cb(
          candidate,
          candidates.filter((other) => other.id !== candidate.id),
          matched,
          tiles
        );
      } else {
        candidate.reset();
      }
    }
  });
};

const searchForNeighbors = (tile, candidates, matched, tiles) => {
  const common = [tile, candidates, matched, tiles, searchForNeighbors];
  search(...common, ["top", "bottom"]);
  search(...common, ["right", "left"]);
  search(...common, ["bottom", "top"]);
  search(...common, ["left", "right"]);

  tiles
    .filter((tile1) => tile1.id !== tile.id)
    .forEach((otherTile) => {
      if (Object.values(otherTile.edges).includes(tile.top)) {
        tile.neighbors.set("top", otherTile);
      }
      if (Object.values(otherTile.edges).includes(tile.right)) {
        tile.neighbors.set("right", otherTile);
      }
      if (Object.values(otherTile.edges).includes(tile.bottom)) {
        tile.neighbors.set("bottom", otherTile);
      }
      if (Object.values(otherTile.edges).includes(tile.left)) {
        tile.neighbors.set("left", otherTile);
      }
    });
};

const arrangeTiles = (tiles) => {
  const startingTile = tiles[0];
  const matchedTileIds = [];
  const otherTiles = tiles.filter(
    (otherTile) => startingTile.id !== otherTile.id
  );
  searchForNeighbors(startingTile, otherTiles, matchedTileIds, tiles);
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
  let currentTile = keyTile;
  const data = [];
  while (currentTile) {
    data.push(...traverseRight(currentTile));
    currentTile = currentTile.neighbors.has("bottom")
      ? currentTile.neighbors.get("bottom")
      : null;
  }

  return data;
};

const rotateData = (data) => {
  const dataReversed = [...data].reverse();
  let rotatedData = [];
  data.forEach((l, index) => {
    dataReversed.forEach((line) => {
      rotatedData[index] = (rotatedData[index] || "") + line[index];
    });
  });
  return rotatedData;
};

const flipData = (data) =>
  data.map((line) => line.split("").reverse().join(""));

const isMonsterFound = ([x, y], data) =>
  data[y][x] === "#" &&
  data[y + 1][x + 1] === "#" &&
  data[y + 1][x + 4] === "#" &&
  data[y][x + 5] === "#" &&
  data[y][x + 6] === "#" &&
  data[y + 1][x + 7] === "#" &&
  data[y + 1][x + 10] === "#" &&
  data[y][x + 11] === "#" &&
  data[y][x + 12] === "#" &&
  data[y + 1][x + 13] === "#" &&
  data[y + 1][x + 16] === "#" &&
  data[y][x + 17] === "#" &&
  data[y][x + 18] === "#" &&
  data[y - 1][x + 18] === "#" &&
  data[y][x + 19] === "#";

const countSeaMonsters = (data) => {
  const monsterHeight = 3;
  const monsterWidth = 20;

  let yIndex = 1;
  let count = 0;

  while (yIndex + monsterHeight <= data.length) {
    let xIndex = 0;
    while (xIndex + monsterWidth <= data.length) {
      const found = isMonsterFound([xIndex, yIndex], data);
      if (found) {
        count += 1;
      }
      xIndex += 1;
    }
    yIndex += 1;
  }

  return count;
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

  let arrangedData = traverseTiles(keyTile);
  let count = 0;
  let timesSearched = 0;

  while (count === 0 && timesSearched <= 8) {
    count += countSeaMonsters(arrangedData);
    timesSearched += 1;
    arrangedData = rotateData(arrangedData);

    if (timesSearched === 4) {
      arrangedData = rotateData(arrangedData);
      arrangedData = flipData(arrangedData);
    }
  }

  return (
    arrangedData.reduce(
      (total, line) =>
        total + line.split("").filter((point) => point === "#").length,
      0
    ) -
    count * 15
  );
}

module.exports = { part1, part2 };
