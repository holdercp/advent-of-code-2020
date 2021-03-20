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

// START REFACTOR

const OPERATORS = {
  add: "+",
  multiply: "*",
};

const OPERATIONS = {
  "+": (a1, a2) => a1 + a2,
  "*": (f1, f2) => f1 * f2,
};

const PARENS = {
  open: "(",
  close: ")",
};

const getLastItem = (arr) => arr[arr.length - 1];

const refactoredEvaluate = (expression) => {
  const tokens = expression.split(" ").join("");
  const operands = [];
  const operators = [];

  const executeOperation = () => {
    const operator = operators.pop();
    const operand1 = operands.pop();
    const operand2 = operands.pop();
    const result = OPERATIONS[operator](operand1, operand2);
    operands.push(result);
  };

  const processStacks = () => {
    let latestOperator = getLastItem(operators);
    while (latestOperator && latestOperator !== PARENS.open) {
      executeOperation();
      latestOperator = getLastItem(operators);
    }
  };

  let index = 0;
  while (index < tokens.length || operators.length > 0) {
    const token = parseInt(tokens[index], 10) || tokens[index];

    if (Number.isInteger(token)) {
      operands.push(token);
    } else if (token === OPERATORS.add || token === OPERATORS.multiply) {
      processStacks();
      operators.push(token);
    } else if (token === PARENS.open) {
      operators.push(token);
    } else if (token === PARENS.close) {
      processStacks();
      operators.pop();
    } else {
      executeOperation();
    }

    index += 1;
  }

  return operands.pop();
};

function part1() {
  return data.reduce(
    (sum, expression) => sum + refactoredEvaluate(expression),
    0
  );
}

function part2() {
  PART = 2;
  return data.reduce((sum, expression) => sum + evaluate(expression), 0);
}

module.exports = { part1, part2 };
