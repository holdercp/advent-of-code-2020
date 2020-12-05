"use strict";

const path = require("path");
const {
  readAndTransformInputFile,
} = require("../helpers/readAndTransformInputFile");

const inputFilePath = path.resolve(__dirname, "./input.txt");

const passes = readAndTransformInputFile(inputFilePath);

const ROW_ZONE = [...Array(128).keys()];
const COL_ZONE = [...Array(8).keys()];
const DIVIDER_MAPPING = {
  F: "lower",
  B: "upper",
  L: "lower",
  R: "upper",
};

const splitAtIndex = (str, index) => [str.slice(0, index), str.slice(index)];

const halveZone = (zone, divider) => {
  const mid = Math.round((zone.length - 1) / 2);
  if (zone.length === 2) {
    return divider === "lower" ? zone[0] : zone[1];
  }

  return divider === "lower" ? zone.slice(0, mid) : zone.slice(mid);
};

const zoneReducer = (zone, divider) =>
  halveZone(zone, DIVIDER_MAPPING[divider]);

const getSeatNumber = (pass) => {
  const [rowDividers, colDividers] = splitAtIndex(pass, 7);
  const rowNumber = rowDividers.split("").reduce(zoneReducer, ROW_ZONE);
  const colNumber = colDividers.split("").reduce(zoneReducer, COL_ZONE);
  return [rowNumber, colNumber];
};

const getSeatId = (pass) => {
  const [row, col] = getSeatNumber(pass);
  return row * 8 + col;
};

function getSolution(part = "1") {
  return passes.map(getSeatId).sort((a, b) => b - a)[0];
}

module.exports = { getSolution };
