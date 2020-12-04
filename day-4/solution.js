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

const hasRequiredFields = (passport) => {
  const requiredFields = ["hgt", "hcl", "pid", "ecl", "eyr", "iyr", "byr"];
  return requiredFields.every((field) => Object.keys(passport).includes(field));
};

const hasValidBirthYear = ({ byr }) => {
  const byrAsInt = parseInt(byr, 10);
  if (!byr || Number.isNaN(byrAsInt)) {
    return false;
  }

  return isIntegerInRange(byrAsInt, 1920, 2002);
};

const hasValidIssueYear = ({ iyr }) => {
  const iyrAsInt = parseInt(iyr, 10);
  if (!iyr || Number.isNaN(iyrAsInt)) {
    return false;
  }
  return isIntegerInRange(iyrAsInt, 2010, 2020);
};

const hasValidExpirationYear = ({ eyr }) => {
  const eyrAsInt = parseInt(eyr, 10);
  if (!eyr || Number.isNaN(eyrAsInt)) {
    return false;
  }
  return isIntegerInRange(eyrAsInt, 2020, 2030);
};

const hasValidHeight = ({ hgt }) => {
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
  const validColors = ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"];
  return validColors.includes(ecl);
};

const hasValidPassportId = ({ pid }) =>
  pid.length === 9 && !Number.isNaN(parseInt(pid, 10));

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

function getSolution(part = "1") {
  const filterFunction = part === "2" ? isValidFilter : hasRequiredFieldsFilter;
  return passportData.filter(filterFunction).length;
}

module.exports = { getSolution };
