"use strict";

const path = require("path");
const {
  readAndTransformInputFile,
} = require("../helpers/readAndTransformInputFile");

const inputFilePath = path.resolve(__dirname, "./input.txt");

const normalizeBagColor = (color) =>
  color
    .split(" bag")[0]
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());

const innerBagReducer = (data, bag) => {
  const separatorIndex = bag.indexOf(" ");
  const count = bag.slice(0, separatorIndex);
  if (count === "no") {
    return null;
  }

  const color = bag.slice(separatorIndex + 1);
  const normalizedColor = normalizeBagColor(color);
  return Object.assign({}, data, { [normalizedColor]: parseInt(count, 10) });
};

const bagRuleReducer = (data, rule) => {
  const [color, contents] = rule.split(" contain ");
  const normalizedColor = normalizeBagColor(color);
  const innerBags = contents.split(", ");
  const bagContents = innerBags.reduce(innerBagReducer, {});

  return Object.assign({}, data, { [normalizedColor]: bagContents });
};

const bagRules = readAndTransformInputFile(inputFilePath).reduce(
  bagRuleReducer,
  {}
);

const searchBag = (color, searchColor) => {
  if (color === searchColor) {
    return true;
  }
  if (bagRules[color] === null) {
    return false;
  }

  return Object.keys(bagRules[color]).some((innerColor) =>
    searchBag(innerColor, searchColor)
  );
};

const searchBagFilter = (color) => {
  if (!color || color === "shinyGold") {
    return false;
  }
  return searchBag(color, "shinyGold");
};

const getInnerBagCount = (color) => {
  if (bagRules[color] === null) {
    return 0;
  }
  return Object.entries(bagRules[color]).reduce((count, innerColor) => {
    return count + innerColor[1] * (1 + getInnerBagCount(innerColor[0]));
  }, 0);
};

function part1() {
  return Object.keys(bagRules).filter(searchBagFilter).length;
}

function part2() {
  return getInnerBagCount("shinyGold");
}

module.exports = { part1, part2 };
