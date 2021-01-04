"use strict";

const path = require("path");
const {
  readAndTransformInputFile,
} = require("../helpers/readAndTransformInputFile");

const inputFilePath = path.resolve(__dirname, "./input.txt");
const [cardPublicKey, doorPublicKey] = readAndTransformInputFile(
  inputFilePath
).map(Number);

function transform(value, subjectNumber) {
  const DIVISOR = 20201227;
  return (value * subjectNumber) % DIVISOR;
}

function findLoopSize(publicKey) {
  const SUBJECT_NUMBER = 7;
  let result = 1;
  let loopSize = 0;

  while (result !== publicKey) {
    loopSize += 1;
    result = transform(result, SUBJECT_NUMBER);
  }

  return loopSize;
}

function calcEncryptionKey(loopSize, publicKey) {
  let encryptionKey = 1;
  for (let i = 0; i < loopSize; i += 1) {
    encryptionKey = transform(encryptionKey, publicKey);
  }

  return encryptionKey;
}

function part1() {
  const cardLoopSize = findLoopSize(cardPublicKey);

  return calcEncryptionKey(cardLoopSize, doorPublicKey);
}

function part2() {
  return "Merry Christmas";
}

module.exports = { part1, part2 };
