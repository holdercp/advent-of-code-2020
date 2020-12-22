"use strict";

const path = require("path");
const {
  readAndTransformInputFile,
} = require("../helpers/readAndTransformInputFile");

const inputFilePath = path.resolve(__dirname, "./input.txt");

const parseDecks = (raw) =>
  raw
    .split("\n")
    .filter((card, index) => index > 0)
    .map(Number);

const decks = readAndTransformInputFile(inputFilePath, "\n\n").map(parseDecks);

function checkGameWon(deck1, deck2) {
  return deck1.length === 0 || deck2.length === 0;
}

function playRound(deck1, deck2) {
  let d1 = [...deck1];
  let d2 = [...deck2];
  let c1 = d1.shift();
  let c2 = d2.shift();
  if (c1 === c2) {
    console.log(`Draw in round.`);
  }

  if (c1 > c2) {
    d1.push(c1, c2);
  } else {
    d2.push(c2, c1);
  }

  return [d1, d2];
}

function getWinner(deck1, deck2) {
  return deck1.length === 0 ? deck2 : deck1;
}

function play(deck1, deck2) {
  let isGameWon = false;
  let d1 = [...deck1];
  let d2 = [...deck2];

  while (!isGameWon) {
    [d1, d2] = playRound(d1, d2);
    isGameWon = checkGameWon(d1, d2);
  }

  return getWinner(d1, d2);
}

function calcScore(deck) {
  return deck.reduceRight((score, card, index, array) => {
    const multiplier = array.length - index;
    return score + card * multiplier;
  }, 0);
}

function part1() {
  const winner = play(...decks);
  return calcScore(winner);
}

function part2() {
  return "NOT_IMPLEMENTED";
}

module.exports = { part1, part2 };
