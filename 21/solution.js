"use strict";

const path = require("path");
const {
  readAndTransformInputFile,
} = require("../helpers/readAndTransformInputFile");

function getIntersection(setA, setB) {
  let intersection = new Set();
  setB.forEach((elem) => {
    if (setA.has(elem)) {
      intersection.add(elem);
    }
  });
  return intersection;
}

function unite(setA, setB) {
  let union = new Set(setA);
  setB.forEach((elem) => {
    union.add(elem);
  });
  return union;
}

function getDifference(setA, setB) {
  let difference = new Set(setA);
  setB.forEach((elem) => {
    difference.delete(elem);
  });
  return difference;
}

function sortAlphabetically([a], [b]) {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
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
  const allIngredients = lines.map(([ingredients]) => ingredients).flat();
  const allUniqueIngredients = new Set(allIngredients);

  let allergicIngredients = new Set();
  map.forEach((ingredients) => {
    allergicIngredients = unite(allergicIngredients, ingredients);
  });

  const nonAllergicIngredients = getDifference(
    allUniqueIngredients,
    allergicIngredients
  );

  const total = Array.from(allIngredients).reduce(
    (count, ingredient) =>
      Array.from(nonAllergicIngredients).includes(ingredient)
        ? count + 1
        : count,
    0
  );

  return total;
}

function part2() {
  let matches = new Map();
  while (map.size) {
    map.forEach((ingredients, allergen) => {
      if (ingredients.size === 1) {
        const ingredient = ingredients.values().next().value;
        matches.set(allergen, ingredient);
        map.delete(allergen);

        map.forEach((ingredientCandidates) => {
          ingredientCandidates.delete(ingredient);
        });
      }
    });
  }

  const dangerousIngredients = Array.from(matches.entries())
    .sort(sortAlphabetically)
    .map(([, ingredient]) => ingredient);

  return dangerousIngredients.join(",");
}

module.exports = { part1, part2 };
