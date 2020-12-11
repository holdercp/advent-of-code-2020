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

function getAdjacentSeatsCount(seatCoordinates, grid) {
  const [row, col] = seatCoordinates;
  const firstRow = 0;
  const firstCol = 0;
  const lastRow = grid.length - 1;
  const lastCol = grid[row].length - 1;
  const positions = {
    upLeft: null,
    up: null,
    upRight: null,
    left: null,
    right: null,
    downLeft: null,
    down: null,
    downRight: null,
  };

  if (row > firstRow) {
    positions.up = grid[row - 1][col];

    if (col > firstCol) {
      positions.upLeft = grid[row - 1][col - 1];
    }

    if (col < lastCol) {
      positions.upRight = grid[row - 1][col + 1];
    }
  }

  if (row < lastRow) {
    positions.down = grid[row + 1][col];

    if (col > firstCol) {
      positions.downLeft = grid[row + 1][col - 1];
    }

    if (col < lastCol) {
      positions.downRight = grid[row + 1][col + 1];
    }
  }

  if (col > firstCol) {
    positions.left = grid[row][col - 1];
  }

  if (col < lastCol) {
    positions.right = grid[row][col + 1];
  }

  const positionStates = Object.values(positions);
  const occupied = positionStates.filter(
    (position) => position === SEAT_MAP.occupied
  ).length;
  const empty = positionStates.filter((position) => position === SEAT_MAP.empty)
    .length;

  return { occupied, empty };
}

function transformSeat(seatCoordinates, grid) {
  const [row, col] = seatCoordinates;
  const seat = grid[row][col];

  // If a seat is empty (L) and there are no occupied seats adjacent to it, the seat becomes occupied.
  // If a seat is occupied (#) and four or more seats adjacent to it are also occupied, the seat becomes empty.
  // Otherwise, the seat's state does not change.

  if (seat === SEAT_MAP.empty) {
    const { occupied } = getAdjacentSeatsCount(seatCoordinates, grid);
    if (occupied === 0) {
      return SEAT_MAP.occupied;
    }
  }

  if (seat === SEAT_MAP.occupied) {
    const { occupied } = getAdjacentSeatsCount(seatCoordinates, grid);
    if (occupied >= 4) {
      return SEAT_MAP.empty;
    }
  }

  return seat;
}

function transform(layout) {
  let seatsChanged;
  let transformedLayout = layout.map((row) => row.map((col) => col));

  while (seatsChanged !== 0) {
    seatsChanged = 0;
    let layoutCopy = transformedLayout.map((row) => row.map((col) => col));
    for (let row = 0; row < layout.length; row += 1) {
      const currentRow = layoutCopy[row];

      for (let col = 0; col < currentRow.length; col += 1) {
        const currentSeat = layoutCopy[row][col];
        const transformedSeat = transformSeat([row, col], layoutCopy);

        transformedLayout[row][col] = transformedSeat;

        if (currentSeat !== transformedSeat) {
          seatsChanged += 1;
        }
      }
    }
  }

  let occupiedCount = 0;
  transformedLayout.forEach((row) => {
    occupiedCount += row.filter((seat) => seat === SEAT_MAP.occupied).length;
  });

  return occupiedCount;
}

function part1() {
  return transform(layout);
}

function part2() {
  return "NOT_IMPLEMENTED";
}

module.exports = { part1, part2 };
