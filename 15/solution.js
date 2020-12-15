"use strict";

const path = require("path");
const {
  readAndTransformInputFile,
} = require("../helpers/readAndTransformInputFile");

const inputFilePath = path.resolve(__dirname, "./input.txt");
const numbers = readAndTransformInputFile(inputFilePath, ",");

function part1() {
  let game = {};
  let prevNumber = 0;

  for (let i = 1; i <= 2020; i += 1) {
    if (i <= numbers.length) {
      const number = numbers[i - 1];
      game = Object.assign({}, game, {
        [number]: { prevRound: null, recentRound: i, count: 1 },
      });
      prevNumber = number;
    } else {
      const { prevRound, recentRound, count } = game[prevNumber];

      if (count > 1) {
        const age = recentRound - prevRound;
        game = Object.assign(
          {},
          game,
          game[age]
            ? {
                [age]: {
                  prevRound: game[age].recentRound,
                  recentRound: i,
                  count: game[age].count + 1,
                },
              }
            : {
                [age]: {
                  prevRound: null,
                  recentRound: i,
                  count: 1,
                },
              }
        );
        prevNumber = age;
      } else {
        game = Object.assign(
          {},
          game,
          game["0"]
            ? {
                ["0"]: {
                  prevRound: game["0"].recentRound,
                  recentRound: i,
                  count: game["0"].count + 1,
                },
              }
            : {
                ["0"]: {
                  prevRound: null,
                  recentRound: i,
                  count: 1,
                },
              }
        );
        prevNumber = "0";
      }
    }
  }

  return prevNumber;
}

function part2() {
  return "NOT_IMPLEMENTED";
}

module.exports = { part1, part2 };
