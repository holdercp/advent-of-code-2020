"use strict";

const path = require("path");
const {
  readAndTransformInputFile,
} = require("../helpers/readAndTransformInputFile");
const Cube = require("./Cube");

const inputFilePath = path.resolve(__dirname, "./input.txt");
const initialState = readAndTransformInputFile(inputFilePath).map((state) =>
  state.split("")
);

const BOOT_SEQUENCES = 6;
const ACTIVE_STATE = "#";

const activeCubes = new Map();
initialState.forEach((xDimensions, y) => {
  xDimensions.forEach((state, x) => {
    if (state === ACTIVE_STATE) {
      activeCubes.set(`${x}.${y}.0`, new Cube([x, y, 0]));
    }
  });
});

function part1() {
  [...Array(BOOT_SEQUENCES)].forEach(() => {
    const makeActiveQueue = [];
    const makeInactiveQueue = [];
    const activeNeighborCountMap = new Map();

    activeCubes.forEach((cube) => {
      for (let z = -1; z <= 1; z += 1) {
        for (let y = -1; y <= 1; y += 1) {
          for (let x = -1; x <= 1; x += 1) {
            if (!(x === 0 && y === 0 && z === 0)) {
              const { id } = new Cube([cube.x + x, cube.y + y, cube.z + z]);

              if (activeCubes.has(id)) {
                cube.incrementActiveNeighborCount();
              } else if (activeNeighborCountMap.has(id)) {
                activeNeighborCountMap.set(
                  id,
                  activeNeighborCountMap.get(id) + 1
                );
              } else {
                activeNeighborCountMap.set(id, 1);
              }
            }
          }
        }
      }

      if (cube.activeNeighborCount !== 2 && cube.activeNeighborCount !== 3) {
        makeInactiveQueue.push(cube.id);
      }
      cube.resetActiveNeighborCount();
    });

    activeNeighborCountMap.forEach((count, id) => {
      if (count === 3) {
        makeActiveQueue.push(id);
      }
    });

    makeInactiveQueue.forEach((id) => {
      activeCubes.delete(id);
    });
    makeActiveQueue.forEach((id) => {
      activeCubes.set(id, new Cube(id.split(".").map(Number)));
    });
  });

  return activeCubes.size;
}

function part2() {
  return "NOT_IMPLEMENTED";
}

module.exports = { part1, part2 };
