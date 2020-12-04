"use strict";

const fs = require("fs");

function readAndTransformInputFile(inputFilePath, splitOn = "\n") {
  return fs.readFileSync(inputFilePath).toString().trimEnd().split(splitOn);
}

module.exports = { readAndTransformInputFile };
