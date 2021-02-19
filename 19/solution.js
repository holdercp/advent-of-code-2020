"use strict";

const path = require("path");
const {
  readAndTransformInputFile,
} = require("../helpers/readAndTransformInputFile");

const inputFilePath = path.resolve(__dirname, "./input.txt");
const [rules, message] = readAndTransformInputFile(
  inputFilePath,
  "\n\n"
).map((raw) => raw.split("\n"));

function part1() {
  return [rules, message];
}

function part2() {
  return "NOT_IMPLEMENTED";
}

module.exports = { part1, part2 };
