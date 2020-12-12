"use strict";

const path = require("path");
const {
  readAndTransformInputFile,
} = require("../helpers/readAndTransformInputFile");

const inputFilePath = path.resolve(__dirname, "./input.txt");
const navigationData = readAndTransformInputFile(inputFilePath);

class Ship {
  constructor() {
    this.bearing = 90;
    this.lateralPosition = 0;
    this.longitudinalPosition = 0;

    this.degreeMap = new Map([
      [0, "N"],
      [90, "E"],
      [180, "S"],
      [270, "W"],
    ]);

    this.directionalMap = new Map([
      ["E", "lateral"],
      ["W", "lateral"],
      ["N", "longitudinal"],
      ["S", "longitudinal"],
    ]);
  }

  get direction() {
    return this.degreeMap.get(this.bearing);
  }

  get position() {
    return [this.lateralPosition, this.longitudinalPosition];
  }

  getDirectionType(direction) {
    return this.directionalMap.get(direction);
  }

  changeBearing(bearing) {
    const direction = bearing.substring(0, 1);
    const degree = parseInt(bearing.substring(1), 10);

    const rawDegree =
      direction === "L" ? this.bearing - degree : this.bearing + degree;
    this.bearing = (rawDegree + 360) % 360;
  }

  move(instruction) {
    const instructionDirection = instruction.substring(0, 1);
    const instructionAmount = parseInt(instruction.substring(1), 10);

    const direction =
      instructionDirection === "F" ? this.direction : instructionDirection;

    if (this.getDirectionType(direction) === "lateral") {
      const amount =
        direction === "E" ? instructionAmount : instructionAmount * -1;
      this.lateralPosition += amount;
    } else {
      const amount =
        direction === "N" ? instructionAmount : instructionAmount * -1;
      this.longitudinalPosition += amount;
    }
  }
}

function part1() {
  const ship = new Ship();

  navigationData.forEach((instruction) => {
    const type = instruction[0];
    if (type === "R" || type === "L") {
      ship.changeBearing(instruction);
    } else {
      ship.move(instruction);
    }
  });

  const [latitude, longitude] = ship.position;
  return Math.abs(latitude) + Math.abs(longitude);
}

function part2() {
  return "NOT_IMPLEMENTED";
}

module.exports = { part1, part2 };
