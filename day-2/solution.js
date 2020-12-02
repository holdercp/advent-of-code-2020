"use strict";

const path = require("path");
const fs = require("fs");

const inputFilePath = path.resolve(__dirname, "./input.txt");

const parsePasswordData = (passwordDataString) => {
  const passwordData = passwordDataString.split(" ");
  const countData = passwordData[0].split("-");

  const countRange = countData.map((count) => parseInt(count, 10));
  const character = passwordData[1][0];
  const password = passwordData[2];

  return {
    countRange,
    character,
    password,
  };
};

const passwordMap = fs
  .readFileSync(inputFilePath)
  .toString()
  .trimEnd()
  .split("\n")
  .map(parsePasswordData);

const validPasswordFilter = (passwordMapping) => {
  const { countRange, character, password } = passwordMapping;
  const characterCount = password.split(character).length - 1;
  return characterCount >= countRange[0] && characterCount <= countRange[1];
};

function getSolution() {
  return passwordMap.filter(validPasswordFilter).length;
}

module.exports = { getSolution };
