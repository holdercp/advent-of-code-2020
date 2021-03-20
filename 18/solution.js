"use strict";

const path = require("path");
const {
  readAndTransformInputFile,
} = require("../helpers/readAndTransformInputFile");

const inputFilePath = path.resolve(__dirname, "./input.txt");
const data = readAndTransformInputFile(inputFilePath);

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

const PRECEDENCE_MAP = {
  [PARENS.open]: 0,
  [PARENS.close]: 1, // Makes algorithm much cleaner to increase the weight here
  [OPERATORS.add]: 2,
  [OPERATORS.multiply]: 2,
};

const isOperation = (token) =>
  token === OPERATORS.add || token === OPERATORS.multiply;

const getLastItem = (arr) => arr[arr.length - 1];

const hasGreaterOrEqualPrecedence = (operator1, operator2) => {
  if (!operator1 || !operator2) return false;
  return PRECEDENCE_MAP[operator1] >= PRECEDENCE_MAP[operator2];
};

const evaluate = (expression) => {
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

  const processStacks = (token) => {
    let latestOperator = getLastItem(operators);
    while (hasGreaterOrEqualPrecedence(latestOperator, token)) {
      executeOperation();
      latestOperator = getLastItem(operators);
    }
  };

  let index = 0;
  while (index < tokens.length || operators.length > 0) {
    const token = parseInt(tokens[index], 10) || tokens[index];

    if (Number.isInteger(token)) {
      operands.push(token);
    } else if (isOperation(token)) {
      processStacks(token);
      operators.push(token);
    } else if (token === PARENS.open) {
      operators.push(token);
    } else if (token === PARENS.close) {
      processStacks(token);
      operators.pop();
    } else {
      executeOperation();
    }

    index += 1;
  }

  return operands.pop();
};

function part1() {
  return data.reduce((sum, expression) => sum + evaluate(expression), 0);
}

function part2() {
  PRECEDENCE_MAP[OPERATORS.add] = 3; // Increase the precedence for part 2
  return data.reduce((sum, expression) => sum + evaluate(expression), 0);
}

module.exports = { part1, part2 };
