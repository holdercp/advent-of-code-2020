"use strict";

const path = require("path");
const {
  readAndTransformInputFile,
} = require("../helpers/readAndTransformInputFile");

const inputFilePath = path.resolve(__dirname, "./input.txt");
const [timeRaw, idsRaw] = readAndTransformInputFile(inputFilePath);

function findTimestamp(timestamp, interval, id, offset) {
  let isMultiple = false;
  let timestampIteration = timestamp;

  while (!isMultiple) {
    isMultiple = (timestampIteration + offset) % id === 0;

    if (!isMultiple) {
      timestampIteration += interval;
    }
  }

  return { timestamp: timestampIteration, interval: interval * id };
}

function part1() {
  const readyTime = Number(timeRaw);
  const busIds = idsRaw
    .split(",")
    .filter((id) => id !== "x")
    .map(Number);

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
  const offsetReducer = (offsets, id, index) =>
    id === "x" ? offsets : Object.assign({}, offsets, { [id]: index });

  const ids = idsRaw.split(",");
  const offsets = ids.reduce(offsetReducer, {});
  const idsOnly = ids.filter((id) => id !== "x").map(Number);

  const findTimestampReducer = ({ timestamp, interval }, id) =>
    findTimestamp(timestamp, interval, id, offsets[id]);

  const { timestamp } = idsOnly.slice(1).reduce(findTimestampReducer, {
    timestamp: idsOnly[0],
    interval: idsOnly[0],
  });

  return timestamp;
}

module.exports = { part1, part2 };
