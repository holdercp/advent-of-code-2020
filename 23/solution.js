"use strict";

const path = require("path");
const {
  readAndTransformInputFile,
} = require("../helpers/readAndTransformInputFile");

const MOVES = 100;

const inputFilePath = path.resolve(__dirname, "./input.txt");
const data = readAndTransformInputFile(inputFilePath)[0].split("").map(Number);

function pickup(cups, currentIndex) {
  let picked = [];
  for (let i = 1; i <= 3; i += 1) {
    const position = (currentIndex + i) % cups.length;
    picked.push(cups[position]);
  }

  const remaining = cups.filter((cup) => !picked.includes(cup));

  return { picked, remaining };
}

function chooseDestination(remaining, currentValue) {
  const candidates = [...remaining].sort((a, b) => b - a);
  const currentIndex = candidates.indexOf(currentValue);
  const value = candidates[(currentIndex + 1) % candidates.length];
  const index = remaining.indexOf(value);

  return { index, value };
}

function move(cups, current) {
  const { picked, remaining } = pickup(cups, current.index);
  const destination = chooseDestination(remaining, current.value);
  const lower = remaining.slice(0, destination.index + 1);
  const upper = remaining.slice(destination.index + 1);
  return [...lower, ...picked, ...upper];
}

function getOrder(cups) {
  const start = cups.indexOf(1);
  let order = "";
  for (let i = 1; i < cups.length; i += 1) {
    order += cups[(start + i) % cups.length];
  }
  return order;
}

function part1() {
  let cups = [...data];
  let current = { index: 0, value: cups[0] };
  for (let i = 1; i <= MOVES; i += 1) {
    cups = move(cups, current);
    const nextIndex = (cups.indexOf(current.value) + 1) % cups.length;
    current = { index: nextIndex, value: cups[nextIndex] };
  }

  return getOrder(cups);
}

function part2() {
  return "NOT_IMPLEMENTED";
}

module.exports = { part1, part2 };
