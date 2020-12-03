"use strict";

const solutionFunctions = require("./solutionFunctions");

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
