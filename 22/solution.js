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

function getWinner(deck1, deck2) {
  if (deck1.length === 0) {
    return "player2";
  }

  if (deck2.length === 0) {
    return "player1";
  }

  throw new Error(`Bad data in getWinner: ${deck1}:${deck2}`);
}

function calcScore(deck) {
  return deck.reduceRight((score, card, index, array) => {
    const multiplier = array.length - index;
    return score + card * multiplier;
  }, 0);
}

function serializeRound(deck1, deck2) {
  return `${deck1.join(",")}:${deck2.join(",")}`;
}

function playRound(deck1, deck2) {
  let d1 = [...deck1];
  let d2 = [...deck2];
  let c1 = d1.shift();
  let c2 = d2.shift();

  if (c1 > c2) {
    d1.push(c1, c2);
  } else {
    d2.push(c2, c1);
  }

  return [d1, d2];
}

function play(deck1, deck2) {
  let isGameWon = false;
  let d1 = [...deck1];
  let d2 = [...deck2];

  while (!isGameWon) {
    [d1, d2] = playRound(d1, d2);
    isGameWon = checkGameWon(d1, d2);
  }

  return [d1, d2];
}

function playRecursive(deck1, deck2) {
  const prevRounds = new Set();
  let isGameWon = false;
  let d1 = [...deck1];
  let d2 = [...deck2];

  while (!isGameWon) {
    const round = serializeRound(d1, d2);
    if (prevRounds.has(round)) return [d1, []];
    prevRounds.add(round);

    const card1 = d1.shift();
    const card2 = d2.shift();

    let roundWinner;
    if (d1.length >= card1 && d2.length >= card2) {
      const roundResult = playRecursive(d1.slice(0, card1), d2.slice(0, card2));
      roundWinner = getWinner(...roundResult);
    } else {
      roundWinner = card1 > card2 ? "player1" : "player2";
    }

    if (roundWinner === "player1") {
      d1.push(card1, card2);
    } else {
      d2.push(card2, card1);
    }

    isGameWon = checkGameWon(d1, d2);
  }

  return [d1, d2];
}

function part1() {
  const [deck1, deck2] = play(...decks);
  const winner = getWinner(deck1, deck2);
  return winner === "player1" ? calcScore(deck1) : calcScore(deck2);
}

function part2() {
  const [deck1, deck2] = playRecursive(...decks);
  const winner = getWinner(deck1, deck2);
  return winner === "player1" ? calcScore(deck1) : calcScore(deck2);
}

module.exports = { part1, part2 };
