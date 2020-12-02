/* eslint-disable no-console */

"use strict";

const day1 = require("../day-1/solution.js");

const solutionFunctions = {
  day1: day1.getSolution,
};

function logSolution(dayNumber = "1", partNumber = "1") {
  const getSolution = solutionFunctions[`day${dayNumber}`];

  if (!getSolution) {
    console.error(
      "There is no solution.js with a getSolution function for that day."
    );
    return 1;
  }

  const result = getSolution(partNumber);

  console.log(result);
  return 0;
}

module.exports = { logSolution };
