"use strict";

const path = require("path");
const {
  readAndTransformInputFile,
} = require("../helpers/readAndTransformInputFile");

const parseInstructions = (instruction) => {
  const [key, value] = instruction.split(" = ");
  const type = key === "mask" ? key : key.slice(0, 3);

  if (type === "mem") {
    const startIndex = key.indexOf("[");
    const endIndex = key.indexOf("]");
    const address = key.slice(startIndex + 1, endIndex);
    return {
      type,
      address,
      value: Number(value),
    };
  }

  return {
    type,
    address: null,
    value,
  };
};

const inputFilePath = path.resolve(__dirname, "./input.txt");
const instructions = readAndTransformInputFile(inputFilePath).map(
  parseInstructions
);

const BITS = 36;

function convertIntToBinaryArr(int) {
  const binaryArr = int.toString(2).split("");
  const diff = BITS - binaryArr.length;
  const pad = [...Array(diff)].map(() => "0");
  return [...pad, ...binaryArr];
}

function convertBinaryArrToInt(binaryArr) {
  const binaryStr = binaryArr.join("");
  return parseInt(binaryStr, 2);
}

function part1() {
  let mask = "";
  let register = new Map();

  instructions.forEach(({ type, address, value }) => {
    if (type === "mask") {
      mask = value;
    } else {
      const binaryArr = convertIntToBinaryArr(value);
      const maskedArr = binaryArr.map((bit, index) =>
        mask[index] === "X" ? bit : mask[index]
      );
      const maskedInt = convertBinaryArrToInt(maskedArr);
      register.set(address, maskedInt);
    }
  });

  return [...register.values()].reduce((sum, value) => sum + value, 0);
}

function part2() {
  return "NOT_IMPLEMENTED";
}

module.exports = { part1, part2 };
