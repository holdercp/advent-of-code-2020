"use strict";

const path = require("path");
const {
  readAndTransformInputFile,
} = require("../helpers/readAndTransformInputFile");

const inputFilePath = path.resolve(__dirname, "./input.txt");

const buildPassportObjectsReducer = (obj, field) => {
  const [key, value] = field.split(":");
  return Object.assign({}, obj, { [key]: value });
};

const passportData = readAndTransformInputFile(
  inputFilePath,
  "\n\n"
).map((passport) =>
  passport.split(/\s/).reduce(buildPassportObjectsReducer, {})
);

const REQUIRED_FIELDS = ["hgt", "hcl", "pid", "ecl", "eyr", "iyr", "byr"];

const hasRequiredFieldsFilter = (passport) =>
  REQUIRED_FIELDS.every((field) => Object.keys(passport).includes(field));

function getSolution(part = "1") {
  return passportData.filter(hasRequiredFieldsFilter).length;
}

module.exports = { getSolution };
