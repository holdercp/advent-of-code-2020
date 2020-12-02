"use strict";

const fs = require("fs");

/**
 * Returns the value of the "data" property of the json input file at the given path
 * @param {string} path - an absolute path to the input file
 * @returns {*} the value of the "data" property
 *
 * @example
 *
 *    readAndParseInputFile("absolute/path/to/inputFile.json")
 */
function readAndParseInputFile(path = "") {
  const rawData = fs.readFileSync(path);
  const { data } = JSON.parse(rawData);

  return data;
}

module.exports = {
  readAndParseInputFile,
};
