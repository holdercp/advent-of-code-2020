"use strict";

const { logSolution } = require("./utils/logSolution.js");

const dayNumber = process.argv[2];
const partNumber = process.argv[3];
if (!dayNumber || Number.isNaN(parseInt(dayNumber, 10))) {
  throw new Error("You must supply a valid day number.");
}

if (partNumber && Number.isNaN(parseInt(partNumber, 10))) {
  throw new Error("You must supply a valid part number.");
}

logSolution(dayNumber, partNumber);
