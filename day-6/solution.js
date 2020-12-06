"use strict";

const path = require("path");
const {
  readAndTransformInputFile,
} = require("../helpers/readAndTransformInputFile");

const inputFilePath = path.resolve(__dirname, "./input.txt");

const groups = readAndTransformInputFile(inputFilePath, "\n\n").map((group) =>
  group.trim().split("\n")
);

const onlyUniqueFilter = (value, index, arr) => arr.indexOf(value) === index;

const getUniqueAnswers = (answers) => {
  const allAnswers = answers.reduce(
    (answerStr, answer) => answerStr + answer,
    ""
  );
  return allAnswers.split("").filter(onlyUniqueFilter);
};

const getAnswerCounts = (answers) =>
  answers.reduce((acc, answer) => {
    answer.split("").forEach((element) => {
      acc[element] = acc[element] ? acc[element] + 1 : 1;
    });

    return acc;
  }, {});

const uniqueAnswersSum = (sum, group) => sum + getUniqueAnswers(group).length;

const sameAnswersSum = (sum, group) => {
  const answerCounts = getAnswerCounts(group);
  const numOfSameAnswers = Object.values(answerCounts).filter(
    (count) => count === group.length
  ).length;

  return sum + numOfSameAnswers;
};

function getSolution(part = "1") {
  const reducer = part === "2" ? sameAnswersSum : uniqueAnswersSum;
  return groups.reduce(reducer, 0);
}

module.exports = { getSolution };
