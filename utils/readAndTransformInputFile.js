"use strict";

const fs = require("fs");

function readAndTransformInputFile(inputFilePath) {
  return fs.readFileSync(inputFilePath).toString().trimEnd().split("\n");
}

module.exports = { readAndTransformInputFile };
