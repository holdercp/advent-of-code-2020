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

const idToCoordinates = (id) => id.split(".").map(Number);
const shouldDeactivate = ([, count]) => !(count === 2 || count === 3);
const shouldActivate = ([, count]) => count === 3;
const getId = ([id]) => id;

function init(region, dimensions = 3) {
  const activeState = "#";
  const activeCubes = new Map();

  for (let y = 0; y < region.length; y += 1) {
    for (let x = 0; x < region[y].length; x += 1) {
      const state = region[y][x];
      if (state === activeState) {
        const cube =
          dimensions === 3 ? new Cube([x, y, 0]) : new Cube([x, y, 0, 0]);
        activeCubes.set(cube.id, cube);
      }
    }
  }

  return activeCubes;
}

function part1() {
  const activeCubes = init(initialState);

  for (let index = 0; index < BOOT_SEQUENCES; index += 1) {
    const neighbors = { active: {}, inactive: {} };
    activeCubes.forEach((cube) => {
      neighbors.active[cube.id] = 0;
      for (let z = -1; z <= 1; z += 1) {
        for (let y = -1; y <= 1; y += 1) {
          for (let x = -1; x <= 1; x += 1) {
            if (!(x === 0 && y === 0 && z === 0)) {
              const neighbor = new Cube([cube.x + x, cube.y + y, cube.z + z]);
              if (activeCubes.has(neighbor.id)) {
                neighbors.active[cube.id] += 1;
              } else {
                neighbors.inactive[neighbor.id] =
                  (neighbors.inactive[neighbor.id] || 0) + 1;
              }
            }
          }
        }
      }
    });

    const makeInactiveQueue = Object.entries(neighbors.active)
      .filter(shouldDeactivate)
      .map(getId);

    const makeActiveQueue = Object.entries(neighbors.inactive)
      .filter(shouldActivate)
      .map(getId);

    makeInactiveQueue.forEach((id) => {
      activeCubes.delete(id);
    });
    makeActiveQueue.forEach((id) => {
      activeCubes.set(id, new Cube(idToCoordinates(id)));
    });
  }

  return activeCubes.size;
}

function part2() {
  const activeCubes = init(initialState, 4);

  for (let index = 0; index < BOOT_SEQUENCES; index += 1) {
    const neighbors = { active: {}, inactive: {} };
    activeCubes.forEach((cube) => {
      neighbors.active[cube.id] = 0;
      for (let w = -1; w <= 1; w += 1) {
        for (let z = -1; z <= 1; z += 1) {
          for (let y = -1; y <= 1; y += 1) {
            for (let x = -1; x <= 1; x += 1) {
              if (!(x === 0 && y === 0 && z === 0 && w === 0)) {
                const neighbor = new Cube([
                  cube.x + x,
                  cube.y + y,
                  cube.z + z,
                  cube.w + w,
                ]);
                if (activeCubes.has(neighbor.id)) {
                  neighbors.active[cube.id] += 1;
                } else {
                  neighbors.inactive[neighbor.id] =
                    (neighbors.inactive[neighbor.id] || 0) + 1;
                }
              }
            }
          }
        }
      }
    });

    const makeInactiveQueue = Object.entries(neighbors.active)
      .filter(shouldDeactivate)
      .map(getId);

    const makeActiveQueue = Object.entries(neighbors.inactive)
      .filter(shouldActivate)
      .map(getId);

    makeInactiveQueue.forEach((id) => {
      activeCubes.delete(id);
    });
    makeActiveQueue.forEach((id) => {
      activeCubes.set(id, new Cube(idToCoordinates(id)));
    });
  }

  return activeCubes.size;
}

module.exports = { part1, part2 };
