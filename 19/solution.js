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

const resolveWithLoop = (ruleNumber, rulesMap, loopTracker, depth = 0) => {
  const values = rulesMap.get(ruleNumber);
  let nextDepth = depth;

  if (typeof values === "string") {
    return values;
  }

  const resolvedValues = values.reduce((resolved, value) => {
    if (value === "|") {
      return resolved + value;
    }

    if (value === loopTracker.loopedRule) {
      if (depth === loopTracker.max) {
        return resolved + loopTracker.loopedResolution;
      }
      nextDepth += 1;
    }

    return resolved + resolveWithLoop(value, rulesMap, loopTracker, nextDepth);
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

  // Pre-resolve the rules 8 and 11 use
  rulesMap.set("42", resolve("42", rulesMap));
  rulesMap.set("31", resolve("31", rulesMap));

  // Pre-resolve 8 and 11 with enough loops to account for our input
  const loopTrackerFor8 = {
    loopedRule: "8",
    resolution: rulesMap.get("42"),
    max: 10,
  };
  const loopTrackerFor11 = {
    loopedRule: "11",
    resolution: `${rulesMap.get("42")}${rulesMap.get("31")}`,
    max: 10,
  };
  rulesMap.set("8", resolveWithLoop("8", rulesMap, loopTrackerFor8));
  rulesMap.set("11", resolveWithLoop("11", rulesMap, loopTrackerFor11));

  const matcher = resolve("0", rulesMap);
  const pattern = new RegExp(matcher, "g");

  const matches = messages.filter((message) => {
    const match = message.match(pattern);
    return match && match[0] === message;
  });

  return matches.length;
}

module.exports = { part1, part2 };
