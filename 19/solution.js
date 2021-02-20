"use strict";

const path = require("path");
const {
  readAndTransformInputFile,
} = require("../helpers/readAndTransformInputFile");

const inputFilePath = path.resolve(__dirname, "./input.txt");
const [rules, messages] = readAndTransformInputFile(
  inputFilePath,
  "\n\n"
).map((raw) => raw.split("\n"));

const createMap = (rule) => {
  const [number, valueRaw] = rule.split(": ");
  const values = valueRaw.startsWith('"') ? valueRaw[1] : valueRaw.split(" ");

  return [number, values];
};

const resolve = (ruleNumber, rulesMap) => {
  const values = rulesMap.get(ruleNumber);
  if (typeof values === "string") {
    return values;
  }

  const resolvedValues = values.reduce((resolved, value) => {
    if (value === "|") {
      return resolved + value;
    }

    return resolved + resolve(value, rulesMap);
  }, "");

  return `(${resolvedValues})`;
};

function part1() {
  const rulesMap = new Map(rules.map(createMap));
  const matcher = resolve("0", rulesMap);
  const pattern = new RegExp(matcher, "g");

  const matches = messages.filter((message) => {
    const match = message.match(pattern);
    return match && match[0] === message;
  });

  return matches.length;
}

function part2() {
  const rulesMap = new Map(rules.map(createMap));
  rulesMap.set("8", ["42", "|", "42", "8"]);
  rulesMap.set("11", ["42", "31", "|", "42", "11", "31"]);

  const matcher = resolve("0", rulesMap);
  const pattern = new RegExp(matcher, "g");

  const matches = messages.filter((message) => {
    const match = message.match(pattern);
    return match && match[0] === message;
  });

  return matches.length;
}

module.exports = { part1, part2 };
