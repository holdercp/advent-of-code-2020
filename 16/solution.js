"use strict";

const path = require("path");
const {
  readAndTransformInputFile,
} = require("../helpers/readAndTransformInputFile");

const inputFilePath = path.resolve(__dirname, "./input.txt");
const [rulesRaw, ownTicketRaw, nearbyTicketsRaw] = readAndTransformInputFile(
  inputFilePath,
  "\n\n"
);

// Utils
const parseValues = (values) => values.split(",").map(Number);
const inRange = (value, [min, max]) => value >= min && value <= max;

// Reducers
const rulesReducer = (rules, rule) => {
  const [nameRaw, rangesRaw] = rule.split(": ");
  const ranges = rangesRaw
    .split(" or ")
    .map((range) => range.split("-").map(Number));
  const name = nameRaw
    .split(" ")
    .map((part, index) =>
      index === 0
        ? part
        : `${part.substring(0, 1).toUpperCase()}${part.substring(1)}`
    )
    .join("");

  rules.set(name, ranges);
  return rules;
};

const ticketErrorRateReducer = (errorRate, invalidValue) =>
  errorRate + invalidValue;

// Filters
const invalidValueFilter = (value) =>
  ![...rules.values()].flat().some((range) => inRange(value, range));
const validTicketFilter = (ticket) =>
  ticket.filter(invalidValueFilter).length === 0;

// Data Parsing
const rules = rulesRaw.split("\n").reduce(rulesReducer, new Map());
const ownTicket = ownTicketRaw.split("\n").slice(1).map(parseValues).flat();
const nearbyTickets = nearbyTicketsRaw.split("\n").slice(1).map(parseValues);

function getPositionsMap(fields, rules) {
  const positions = new Map();
  fields.forEach((values, position) => {
    for (let [name, ranges] of rules) {
      if (
        values.every((value) => ranges.some((range) => inRange(value, range)))
      ) {
        if (positions.has(position)) {
          positions.set(position, [...positions.get(position), name]);
        } else {
          positions.set(position, [name]);
        }
      }
    }
  });

  return positions;
}

function getFieldNameMap(positions) {
  const validMapping = new Map();

  while (positions.size) {
    const correctFieldMapping = [...positions.entries()].filter(
      ([position, names]) => names.length === 1
    );

    const [correctPosition, correctName] = correctFieldMapping.flat(2);
    validMapping.set(correctName, correctPosition);
    positions.delete(correctPosition);

    for (let [position, names] of positions) {
      positions.set(
        position,
        names.filter((name) => name !== correctName)
      );
    }
  }

  return validMapping;
}

function part1() {
  const invalidValues = nearbyTickets
    .map((ticket) => ticket.filter(invalidValueFilter))
    .flat();

  return invalidValues.reduce(ticketErrorRateReducer, 0);
}

function part2() {
  const validTickets = [ownTicket, ...nearbyTickets.filter(validTicketFilter)];
  const fieldValuesByPosition = [
    ...Array(ownTicket.length),
  ].map((blank, index) => validTickets.map((ticket) => ticket[index]));

  const positionsMap = getPositionsMap(fieldValuesByPosition, rules);
  const fieldNameMap = getFieldNameMap(positionsMap);

  const departureFieldPositions = [...fieldNameMap.entries()]
    .filter(([name, position]) => name.includes("departure"))
    .map(([name, position]) => position);

  return departureFieldPositions.reduce(
    (product, position) => product * ownTicket[position],
    1
  );
}

module.exports = { part1, part2 };
