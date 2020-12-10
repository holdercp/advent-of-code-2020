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

const isIntegerInRange = (int = 0, min = 0, max = 0) =>
  int >= min && int <= max;

const validateYear = (year, min, max) => {
  const yearInt = parseInt(year, 10);
  if (Number.isNaN(yearInt)) {
    return false;
  }

  return isIntegerInRange(yearInt, min, max);
};

const hasRequiredFields = (passport) => {
  const requiredFields = ["hgt", "hcl", "pid", "ecl", "eyr", "iyr", "byr"];
  return requiredFields.every((field) => Object.keys(passport).includes(field));
};

const hasValidBirthYear = ({ byr }) => validateYear(byr, 1920, 2002);
const hasValidIssueYear = ({ iyr }) => validateYear(iyr, 2010, 2020);
const hasValidExpirationYear = ({ eyr }) => validateYear(eyr, 2020, 2030);

const hasValidHeight = ({ hgt }) => {
  if (!hgt) {
    return false;
  }

  const unit = hgt.slice(-2);
  const digit = parseInt(hgt.slice(0, hgt.length - 2), 10);

  if ((unit !== "cm" && unit !== "in") || Number.isNaN(digit)) {
    return false;
  }

  return (
    (unit === "cm" && isIntegerInRange(digit, 150, 193)) ||
    (unit === "in" && isIntegerInRange(digit, 59, 76))
  );
};

const hasValidHairColor = ({ hcl }) => /^#[0-9a-f]{6}$/.test(hcl);

const hasValidEyeColor = ({ ecl }) => {
  if (!ecl) {
    return false;
  }

  const validColors = ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"];
  return validColors.includes(ecl);
};

const hasValidPassportId = ({ pid }) =>
  pid && pid.length === 9 && !Number.isNaN(parseInt(pid, 10));

const hasRequiredFieldsFilter = (passport) => hasRequiredFields(passport);

const isValidFilter = (passport) => {
  return (
    hasRequiredFields(passport) &&
    hasValidBirthYear(passport) &&
    hasValidIssueYear(passport) &&
    hasValidExpirationYear(passport) &&
    hasValidHeight(passport) &&
    hasValidHairColor(passport) &&
    hasValidEyeColor(passport) &&
    hasValidPassportId(passport)
  );
};

function part1() {
  return passportData.filter(hasRequiredFieldsFilter).length;
}

function part2() {
  return passportData.filter(isValidFilter).length;
}

module.exports = { part1, part2 };
