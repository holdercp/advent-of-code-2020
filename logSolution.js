/* eslint-disable no-console */

"use strict";

const day1 = require("./day-1/solution.js");

const solutionFunctions = {
  day1: day1.getSolution,
};

function logSolution(dayNumber) {
  const getSolution = solutionFunctions[`day${dayNumber}`];

  if (!getSolution) {
    console.error(
      "There is no solution.js with a getSolution function for that day."
    );
    return 1;
  }

  const result = getSolution();

  console.log(result);
  return 0;
}

const dayNumberArg = process.argv[2];
if (!dayNumberArg || typeof parseInt(dayNumberArg, 10) !== "number") {
  console.error("You must supply a valid day number.");
  return 1;
}

return logSolution(dayNumberArg);
