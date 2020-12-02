/* eslint-disable no-console */

"use strict";

const logSolution = require("./utils/logSolution.js").logSolution;

const dayNumber = process.argv[2];
const partNumber = process.argv[3];
if (!dayNumber || typeof parseInt(dayNumber, 10) !== "number") {
  console.error("You must supply a valid day number.");
  return 1;
}

if (partNumber && typeof parseInt(partNumber, 10) !== "number") {
  console.error("You must supply a valid part number.");
  return 1;
}

return logSolution(dayNumber, partNumber);
