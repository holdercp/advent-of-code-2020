"use strict";

const path = require("path");
const {
  readAndTransformInputFile,
} = require("../helpers/readAndTransformInputFile");

const inputFilePath = path.resolve(__dirname, "./input.txt");
const navigationInstructions = readAndTransformInputFile(inputFilePath);

const Ship = require("./Ship");
const ShipController = require("./ShipController");

function part1() {
  const ship = Ship();
  const controller = ShipController(ship);

  navigationInstructions.forEach((instruction) => {
    controller.shipNavigation(instruction);
  });

  const [x, y] = ship.getPosition();
  return Math.abs(x) + Math.abs(y);
}

function part2() {
  const ship = Ship();
  const controller = ShipController(ship);
  navigationInstructions.forEach((instruction) => {
    controller.waypointNavigation(instruction);
  });

  const [x, y] = ship.getPosition();
  return Math.abs(x) + Math.abs(y);
}

module.exports = { part1, part2 };
