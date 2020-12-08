"use strict";

const path = require("path");
const {
  readAndTransformInputFile,
} = require("../helpers/readAndTransformInputFile");

const inputFilePath = path.resolve(__dirname, "./input.txt");

const parsePasswordData = (passwordDataString) => {
  const passwordData = passwordDataString.split(" ");
  const countData = passwordData[0].split("-");

  const indexes = countData.map((count) => parseInt(count, 10));
  const validCharacter = passwordData[1][0];
  const password = passwordData[2];

  return {
    indexes,
    validCharacter,
    password,
  };
};

const passwordMap = readAndTransformInputFile(inputFilePath).map(
  parsePasswordData
);

const validPasswordCountFilter = (passwordMapping) => {
  const { indexes: countRange, validCharacter, password } = passwordMapping;
  const characterCount = password.split(validCharacter).length - 1;
  return characterCount >= countRange[0] && characterCount <= countRange[1];
};

const validPasswordPositionFilter = (passwordMapping) => {
  const { indexes, validCharacter, password } = passwordMapping;
  const charactersToValidate = indexes.map((index) => password[index - 1]);
  const validCharacterCompare = (character) => character === validCharacter;
  return (
    charactersToValidate.some(validCharacterCompare) &&
    !charactersToValidate.every(validCharacterCompare)
  );
};

function part1() {
  return passwordMap.filter(validPasswordCountFilter).length;
}

function part2() {
  return passwordMap.filter(validPasswordPositionFilter).length;
}

module.exports = { part1, part2 };
