"use strict";

const day1 = require("../day-1/solution.js");
const day2 = require("../day-2/solution.js");
const day3 = require("../day-3/solution.js");

const solutionFunctions = {
  day1: day1.getSolution,
  day2: day2.getSolution,
  day3: day3.getSolution,
};

function logSolution(dayNumber = "1", partNumber = "1") {
  const getSolution = solutionFunctions[`day${dayNumber}`];

  if (!getSolution) {
    throw new Error(
      "There is no solution.js with a getSolution function for that day."
    );
  }

  const result = getSolution(partNumber);

  // eslint-disable-next-line no-console
  console.log(result);
}

module.exports = { logSolution };
