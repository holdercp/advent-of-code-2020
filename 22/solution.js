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

  if (c1 > c2) {
    d1.push(c1, c2);
  } else {
    d2.push(c2, c1);
  }

  return [d1, d2];
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

function calcScore(deck) {
  return deck.reduceRight((score, card, index, array) => {
    const multiplier = array.length - index;
    return score + card * multiplier;
  }, 0);
}

function serializeRound(deck1, deck2) {
  return `${deck1.join(",")}:${deck2.join(",")}`;
}

function playRecursive(player1, player2) {
  const prevRounds = new Set();
  let winner = null;

  while (winner === null) {
    const round = serializeRound(player1.deck, player2.deck);
    if (prevRounds.has(round)) return player1;
    prevRounds.add(round);

    const card1 = player1.deck.shift();
    const card2 = player2.deck.shift();

    let roundWinner;
    if (player1.deck.length >= card1 && player2.deck.length >= card2) {
      const player1Copy = Object.assign({}, player1, {
        deck: [...player1.deck],
      });
      const player2Copy = Object.assign({}, player2, {
        deck: [...player2.deck],
      });

      roundWinner = playRecursive(player1Copy, player2Copy);
    } else {
      roundWinner = card1 > card2 ? player1 : player2;
    }

    if (roundWinner.name === "player1") {
      player1.deck.push(card1, card2);
    } else {
      player2.deck.push(card2, card1);
    }

    if (player1.deck.length === 0) {
      winner = player2;
    } else if (player2.deck.length === 0) {
      winner = player1;
    }
  }

  return winner;
}

function part1() {
  const [deck1, deck2] = play(...decks);
  const winner = getWinner(deck1, deck2);
  return winner === "player1" ? calcScore(deck1) : calcScore(deck2);
}

function part2() {
  const [deck1, deck2] = decks;
  const winner = playRecursive(
    { name: "player1", deck: deck1 },
    { name: "player2", deck: deck2 }
  );
  return calcScore(winner.deck);
}

module.exports = { part1, part2 };
