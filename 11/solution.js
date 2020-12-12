"use strict";

const path = require("path");
const {
  readAndTransformInputFile,
} = require("../helpers/readAndTransformInputFile");

const inputFilePath = path.resolve(__dirname, "./input.txt");
const layout = readAndTransformInputFile(inputFilePath).map((row) =>
  row.split("")
);

const SEAT_MAP = {
  occupied: "#",
  empty: "L",
  floor: ".",
};

const DIRECTION_MAP = {
  up: [-1, 0],
  upLeft: [-1, -1],
  upRight: [-1, 1],

  left: [0, -1],
  right: [0, 1],

  down: [1, 0],
  downLeft: [1, -1],
  downRight: [1, 1],
};

const PART_GLOBALS = {
  threshold: 4,
  search: "adjacent",
};

const isOutOfBounds = ([row, col], grid) =>
  row === -1 || col === -1 || row === grid.length || col === grid[0].length;

const applyDirection = (coordinates, direction) =>
  coordinates.map((coordinate, index) => coordinate + direction[index]);

function findSeat(coordinates, grid, direction, search = "adjacent") {
  const searchCoordinates = applyDirection(coordinates, direction);
  if (isOutOfBounds(searchCoordinates, grid)) {
    return null;
  }

  const [rowSearch, colSearch] = searchCoordinates;
  const seatState = grid[rowSearch][colSearch];

  if (search === "visible") {
    return seatState === SEAT_MAP.empty || seatState === SEAT_MAP.occupied
      ? seatState
      : findSeat(searchCoordinates, grid, direction, search);
  }

  return seatState;
}

const findVisibleSeat = (coordinates, grid, direction) =>
  findSeat(coordinates, grid, direction, "visible");
const findAdjacentSeat = (coordinates, grid, direction) =>
  findSeat(coordinates, grid, direction);

function getSeatsCount(seatCoordinates, grid, search = "adjacent") {
  const searchDirections = (searchType) => (
    seats,
    [directionName, directionValues]
  ) => {
    const seat =
      searchType === "visible"
        ? findVisibleSeat(seatCoordinates, grid, directionValues)
        : findAdjacentSeat(seatCoordinates, grid, directionValues);
    return Object.assign({}, seats, { [directionName]: seat });
  };

  const seats = Object.entries(DIRECTION_MAP).reduce(
    searchDirections(search),
    {}
  );

  const seatStates = Object.values(seats);
  const occupied = seatStates.filter(
    (position) => position === SEAT_MAP.occupied
  ).length;
  const empty = seatStates.filter((position) => position === SEAT_MAP.empty)
    .length;

  return { occupied, empty };
}

function transformSeat(seatCoordinates, grid) {
  const [row, col] = seatCoordinates;
  const seat = grid[row][col];

  if (seat === SEAT_MAP.empty) {
    const { occupied } = getSeatsCount(
      seatCoordinates,
      grid,
      PART_GLOBALS.search
    );
    if (occupied === 0) {
      return SEAT_MAP.occupied;
    }
  }

  if (seat === SEAT_MAP.occupied) {
    const { occupied } = getSeatsCount(
      seatCoordinates,
      grid,
      PART_GLOBALS.search
    );
    if (occupied >= PART_GLOBALS.threshold) {
      return SEAT_MAP.empty;
    }
  }

  return seat;
}

function transform(grid) {
  let seatsChanged = true;
  let transformedGrid = grid.map((row) => row.map((col) => col));

  while (seatsChanged) {
    seatsChanged = false;
    let gridCopy = [...transformedGrid];
    transformedGrid = gridCopy.map(() => []);
    for (let row = 0; row < grid.length; row += 1) {
      const currentRow = gridCopy[row];

      for (let col = 0; col < currentRow.length; col += 1) {
        const currentSeat = gridCopy[row][col];
        const transformedSeat = transformSeat([row, col], gridCopy);

        transformedGrid[row][col] = transformedSeat;

        if (currentSeat !== transformedSeat && !seatsChanged) {
          seatsChanged = true;
        }
      }
    }
  }

  return transformedGrid;
}

function part1() {
  const transformedLayout = transform(layout);
  return transformedLayout.reduce(
    (sum, row) => sum + row.filter((seat) => seat === SEAT_MAP.occupied).length,
    0
  );
}

function part2() {
  PART_GLOBALS.search = "visible";
  PART_GLOBALS.threshold = 5;
  const transformedLayout = transform(layout);
  return transformedLayout.reduce(
    (sum, row) => sum + row.filter((seat) => seat === SEAT_MAP.occupied).length,
    0
  );
}

module.exports = { part1, part2 };
