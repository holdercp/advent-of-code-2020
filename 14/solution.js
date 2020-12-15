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
      address: Number(address),
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

function pad(arr, length) {
  const zeros = [...Array(length)].map(() => "0");
  return [...zeros, ...arr];
}

function convertIntToBinaryArr(int, length) {
  const binaryArr = int.toString(2).split("");
  const diff = length - binaryArr.length;
  return pad(binaryArr, diff);
}

function convertBinaryArrToInt(binaryArr) {
  const binaryStr = binaryArr.join("");
  return parseInt(binaryStr, 2);
}

function getPermutations(count) {
  const numOfPerms = Math.pow(2, count);
  return [...Array(numOfPerms)].map((perm, index) =>
    convertIntToBinaryArr(index, count)
  );
}

function getFloatingAddresses(maskedAddressArr) {
  const start = maskedAddressArr.findIndex((bit) => bit === "X" || bit === "1");
  const address = maskedAddressArr.slice(start);
  const floatCount = address.reduce(
    (count, a) => (a === "X" ? count + 1 : count),
    0
  );

  const replaceFloatedBitsAndPad = (perm) => {
    const floated = address.map((bit) => (bit === "X" ? perm.shift() : bit));
    return pad(floated, BITS - floated.length);
  };

  const perms = getPermutations(floatCount);
  return perms.map(replaceFloatedBitsAndPad);
}

function part1() {
  let mask = "";
  let register = new Map();
  const maskV1 = (bit, index) => (mask[index] === "X" ? bit : mask[index]);

  instructions.forEach(({ type, address, value }) => {
    if (type === "mask") {
      mask = value;
    } else {
      const binaryArr = convertIntToBinaryArr(value, BITS);
      const maskedArr = binaryArr.map(maskV1);
      const maskedInt = convertBinaryArrToInt(maskedArr);
      register.set(address, maskedInt);
    }
  });

  return [...register.values()].reduce((sum, value) => sum + value, 0);
}

function part2() {
  let mask = "";
  let register = new Map();
  const maskV2 = (bit, index) => {
    if (mask[index] === "1") return "1";
    if (mask[index] === "X") return "X";
    return bit;
  };
  instructions.forEach(({ type, address, value }) => {
    if (type === "mask") {
      mask = value;
    } else {
      const addressArr = convertIntToBinaryArr(address, BITS);
      const maskedAddressArr = addressArr.map(maskV2);
      const addresses = getFloatingAddresses(maskedAddressArr);
      const decimalAddresses = addresses.map(convertBinaryArrToInt);
      decimalAddresses.forEach((decimalAddress) => {
        register.set(decimalAddress, value);
      });
    }
  });

  return [...register.values()].reduce((sum, value) => sum + value, 0);
}

module.exports = { part1, part2 };
