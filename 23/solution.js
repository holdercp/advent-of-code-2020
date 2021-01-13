"use strict";

const path = require("path");
const {
  readAndTransformInputFile,
} = require("../helpers/readAndTransformInputFile");

const inputFilePath = path.resolve(__dirname, "./input.txt");
const data = readAndTransformInputFile(inputFilePath)[0].split("").map(Number);

const getCircularIndex = (current, offset, arr) =>
  (current + offset) % arr.length;

function pickup(cups, current) {
  const picked = [];
  let pick = cups.get(current);
  for (let i = 0; i < 3; i += 1) {
    picked.push(pick);
    let next = cups.get(pick);
    cups.delete(pick);
    pick = next;
  }
  cups.set(current, pick);
  return picked;
}

function chooseDestination(cups, current, picked) {
  let destination = null;
  let candidate = current - 1;
  while (!destination) {
    if (candidate === 0) {
      candidate = cups.size + picked.length;
    } else if (picked.includes(candidate)) {
      candidate -= 1;
    } else {
      destination = candidate;
    }
  }
  return destination;
}

function insert(cups, picked, destination) {
  const end = cups.get(destination);
  let current = destination;
  picked.forEach((cup) => {
    cups.set(current, cup);
    current = cup;
  });
  cups.set(current, end);
}

function move(cups, current) {
  const picked = pickup(cups, current);
  const destination = chooseDestination(cups, current, picked);
  insert(cups, picked, destination);
}

function getOrder(cups) {
  let next = 1;
  let order = "";

  for (let i = 1; i < cups.size; i += 1) {
    const current = cups.get(next);
    order += String(current);
    next = current;
  }
  return order;
}

function getNextTwo(cups) {
  const one = cups.get(1);
  const two = cups.get(one);
  return [one, two];
}

function getExtraCups(cups, moves) {
  const max = Math.max(...cups);
  const length = moves - max;

  let arr = [];
  for (let i = 1; i <= length; i += 1) {
    arr.push(max + i);
  }
  return arr;
}

function init(cups) {
  const cupsMap = new Map();
  for (let current = 0; current < cups.length; current += 1) {
    const next = getCircularIndex(current, 1, cups);
    cupsMap.set(cups[current], cups[next]);
  }
  return cupsMap;
}

function part1() {
  const moves = 100;
  let cups = init(data);
  let current = cups.keys().next().value;
  for (let i = 1; i <= moves; i += 1) {
    move(cups, current);
    current = cups.get(current);
  }

  return getOrder(cups);
}

function part2() {
  const moves = 10000000;
  let cups = init([...data, ...getExtraCups(data, 1000000)]);
  let current = cups.keys().next().value;
  for (let i = 1; i <= moves; i += 1) {
    move(cups, current);
    current = cups.get(current);
  }
  const [one, two] = getNextTwo(cups);
  return one * two;
}

module.exports = { part1, part2 };
