"use strict";

const path = require("path");
const {
  readAndTransformInputFile,
} = require("../helpers/readAndTransformInputFile");

const inputFilePath = path.resolve(__dirname, "./input.txt");
const data = readAndTransformInputFile(inputFilePath);
let PART = 1;

const operations = {
  "+": (num1, num2) => num1 + num2,
  "*": (num1, num2) => num1 * num2,
};

const isNumber = (value) => !Number.isNaN(+value);
const isOperator = (value) => value === "+" || value === "*";
const isOpenParen = (value) => value === "(";
const isCloseParen = (value) => value === ")";

const createExpressionTracker = (index = null, expression = []) => ({
  index,
  expression,
});

const evaluateTokens = (tokens) => {
  const tokensCopy = [...tokens];
  if (PART === 2) {
    while (tokensCopy.includes("+")) {
      let mutated = false;
      tokensCopy.forEach((token, index) => {
        if (mutated) return;
        if (token === "+") {
          const sum = operations["+"](
            +tokensCopy[index - 1],
            +tokensCopy[index + 1]
          );
          const deleteCount = 3;
          tokensCopy.splice(index - 1, deleteCount, sum);
          mutated = true;
        }
      });
    }
  }

  if (tokensCopy.length === 1) {
    return tokensCopy[0];
  }

  return tokensCopy.reduce((expression, token, index, source) => {
    if (isNumber(token)) {
      const tokenInt = +token;
      if (!expression.has("left")) {
        expression.set("left", tokenInt);
      } else {
        const result = operations[expression.get("operator")](
          expression.get("left"),
          tokenInt
        );

        if (index === source.length - 1) {
          return result;
        }

        expression.set("left", result);
        expression.delete("operator");
      }
    } else if (!expression.has("operator")) {
      expression.set("operator", token);
    }

    return expression;
  }, new Map());
};

const flattenExpression = (expression) => {
  const tokens = expression.split(" ").join("").split("");

  while (tokens.includes("(")) {
    let trackedExpression = null;
    let mutated = false;
    tokens.forEach((token, index) => {
      if (mutated) return;
      if (isNumber(token) || isOperator(token)) {
        if (trackedExpression) {
          trackedExpression.expression.push(token);
        }
      }

      if (isOpenParen(token)) {
        trackedExpression = createExpressionTracker(index);
      }

      if (isCloseParen(token)) {
        const evaluatedExpression = evaluateTokens(
          trackedExpression.expression
        );
        const deleteCount = index - trackedExpression.index + 1;

        tokens.splice(
          trackedExpression.index,
          deleteCount,
          evaluatedExpression
        );
        mutated = true;
      }
    });
  }

  return tokens;
};

const evaluate = (expression) => {
  const flatExpressionTokens = expression.includes("(")
    ? flattenExpression(expression)
    : expression.split(" ").join("").split("");

  return evaluateTokens(flatExpressionTokens);
};

function part1() {
  return data.reduce((sum, expression) => sum + evaluate(expression), 0);
}

function part2() {
  PART = 2;
  return data.reduce((sum, expression) => sum + evaluate(expression), 0);
}

module.exports = { part1, part2 };
