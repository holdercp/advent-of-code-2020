"use strict";

const path = require("path");
const {
  readAndTransformInputFile,
} = require("../helpers/readAndTransformInputFile");

const inputFilePath = path.resolve(__dirname, "./input.txt");
const [timeRaw, idsRaw] = readAndTransformInputFile(inputFilePath);

const readyTime = Number(timeRaw);
const busIds = idsRaw
  .split(",")
  .filter((id) => id !== "x")
  .map(Number);

function part1() {
  const busTimes = busIds.reduce(
    (times, id) =>
      Object.assign({}, times, { [id]: Math.ceil(readyTime / id) * id }),
    {}
  );

  const earliestDepartureTime = Math.min(...Object.values(busTimes));
  const waitTime = earliestDepartureTime - readyTime;

  const [busId, busTime] = Object.entries(busTimes).find(
    ([id, time]) => time === earliestDepartureTime
  );
  return waitTime * busId;
}

function part2() {
  return "NOT_IMPLEMENTED";
}

module.exports = { part1, part2 };
