"use strict";

const path = require("path");
const {
  readAndTransformInputFile,
} = require("../helpers/readAndTransformInputFile");

const inputFilePath = path.resolve(__dirname, "./input.txt");
const instructionsData = readAndTransformInputFile(inputFilePath).map(
  (instruction) => {
    const [operation, rest] = instruction.split(" ");
    const operator = rest.slice(0, 1);
    const value = rest.slice(1);
    return {
      operation,
      operator,
      value: parseInt(value, 10),
    };
  }
);

const performOperation = (oldValue, operator, value) =>
  operator === "+" ? oldValue + value : oldValue - value;
const cloneInstructions = (instruction) => Object.assign({}, instruction);

function runProgram(instructions, returnEarly = false) {
  let linesExecuted = [];
  let accumulator = 0;
  for (let i = 0; i < instructions.length; ) {
    if (linesExecuted.includes(i)) {
      return returnEarly ? accumulator : null;
    }

    linesExecuted.push(i);
    const { operation, operator, value } = instructions[i];

    if (operation === "acc") {
      accumulator = performOperation(accumulator, operator, value);
      i += 1;
    } else if (operation === "jmp") {
      i = performOperation(i, operator, value);
    } else if (operation === "nop") {
      i += 1;
    }
  }

  return accumulator;
}

function debugProgram(instructions) {
  for (let i = 0; i < instructions.length; i += 1) {
    const modInstructions = instructions.map(cloneInstructions);
    const { operation } = modInstructions[i];
    if (operation === "nop") {
      modInstructions[i].operation = "jmp";
    } else if (operation === "jmp") {
      modInstructions[i].operation = "nop";
    }

    const result = runProgram(modInstructions);
    if (result !== null) {
      return result;
    }
  }
  return null;
}

function part1() {
  return runProgram(instructionsData, true);
}

function part2() {
  return debugProgram(instructionsData);
}

module.exports = { part1, part2 };
