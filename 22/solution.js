"use strict";

const path = require("path");
const {
  readAndTransformInputFile,
} = require("../helpers/readAndTransformInputFile");

const inputFilePath = path.resolve(__dirname, "./input.txt");
const data = readAndTransformInputFile(inputFilePath);

function part1() {
  return "NOT_IMPLEMENTED";
}

function part2() {
  return "NOT_IMPLEMENTED";
}

module.exports = { part1, part2 };
