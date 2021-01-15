/* eslint-disable no-restricted-syntax */

"use strict";

const { get } = require("https");
const path = require("path");
const {
  readAndTransformInputFile,
} = require("../helpers/readAndTransformInputFile");

function getIntersection(setA, setB) {
  let intersection = new Set();
  for (let elem of setB) {
    if (setA.has(elem)) {
      intersection.add(elem);
    }
  }
  return intersection;
}

function unite(setA, setB) {
  let union = new Set(setA);
  for (let elem of setB) {
    union.add(elem);
  }
  return union;
}

function getDifference(setA, setB) {
  let difference = new Set(setA);
  for (let elem of setB) {
    difference.delete(elem);
  }
  return difference;
}

const inputFilePath = path.resolve(__dirname, "./input.txt");
const splitLines = (line) => {
  const [ingredientsRaw, allergensRaw] = line.split(" (contains ");
  const ingredients = ingredientsRaw.split(" ");
  const allergens = allergensRaw.slice(0, allergensRaw.length - 1).split(", ");
  return [ingredients, allergens];
};
const createMap = (map, [ingredients, allergens]) => {
  allergens.forEach((allergen) => {
    const ingredientsSet = new Set(ingredients);
    if (map.has(allergen)) {
      map.set(allergen, getIntersection(map.get(allergen), ingredientsSet));
    } else {
      map.set(allergen, ingredientsSet);
    }
  });
  return map;
};
const lines = readAndTransformInputFile(inputFilePath).map(splitLines);
const map = lines.reduce(createMap, new Map());

function part1() {
  const allIngredientsArray = lines.map(([ingredients]) => ingredients).flat();
  const allIngredientsSet = new Set(allIngredientsArray);

  let allergicIngredientsSet = new Set();
  for (const ingredients of map.values()) {
    allergicIngredientsSet = unite(allergicIngredientsSet, ingredients);
  }

  const nonAllergicIngredientsSet = getDifference(
    allIngredientsSet,
    allergicIngredientsSet
  );
  const nonAllergicIngredientsArray = Array.from(nonAllergicIngredientsSet);

  const total = Array.from(allIngredientsArray).reduce(
    (count, ingredient) =>
      nonAllergicIngredientsArray.includes(ingredient) ? count + 1 : count,
    0
  );

  return total;
}

function part2() {
  return "NOT_IMPLEMENTED";
}

module.exports = { part1, part2 };
