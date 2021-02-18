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

const searchForNeighbors = (tile, candidates, matched, tiles) => {
  // Search for top match
  candidates.forEach((candidate) => {
    if (!matched.includes(candidate.id)) {
      let match = false;
      let edgesChecked = 0;
      while (!match && edgesChecked <= 8) {
        if (tile.top === candidate.bottom) {
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
        searchForNeighbors(
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

  // Search for right match
  candidates.forEach((candidate) => {
    if (!matched.includes(candidate.id)) {
      let match = false;
      let edgesChecked = 0;
      while (!match && edgesChecked <= 8) {
        if (tile.right === candidate.left) {
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
        searchForNeighbors(
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

  candidates.forEach((candidate) => {
    if (!matched.includes(candidate.id)) {
      let match = false;
      let edgesChecked = 0;
      while (!match && edgesChecked <= 8) {
        if (tile.bottom === candidate.top) {
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
        searchForNeighbors(
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

  candidates.forEach((candidate) => {
    if (!matched.includes(candidate.id)) {
      let match = false;
      let edgesChecked = 0;
      while (!match && edgesChecked <= 8) {
        if (tile.left === candidate.right) {
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
        searchForNeighbors(
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
