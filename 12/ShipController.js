"use strict";

const directionalMap = new Map([
  ["E", "lateral"],
  ["W", "lateral"],
  ["N", "longitudinal"],
  ["S", "longitudinal"],
]);

function getDirectionType(direction) {
  return directionalMap.get(direction);
}

function ShipController(ship) {
  function parseInstruction(instruction) {
    const command = instruction.substring(0, 1);
    const value = parseInt(instruction.substring(1), 10);

    return [command, value];
  }

  function isRotate(command) {
    return command === "L" || command === "R";
  }

  function isMove(command) {
    return (
      command === "N" || command === "S" || command === "E" || command === "W"
    );
  }

  function isMoveTo(command) {
    return command === "F";
  }

  function shipNavigation(instruction) {
    const [command, value] = parseInstruction(instruction);

    if (isRotate(command)) {
      const degree = command === "R" ? value : value * -1;
      ship.changeBearing(degree);
    } else {
      const direction = isMove(command) ? command : ship.getDirection();
      const directionType = getDirectionType(direction);
      const amount =
        direction === "N" || direction === "E" ? value : value * -1;

      if (directionType === "lateral") {
        ship.moveX(amount);
      } else {
        ship.moveY(amount);
      }
    }
  }

  function waypointNavigation(instruction) {
    const [command, value] = parseInstruction(instruction);

    if (isMoveTo(command)) {
      ship.moveToWaypoint(value);
    } else if (isMove(command)) {
      const direction = command;
      const directionType = getDirectionType(direction);
      const amount =
        direction === "N" || direction === "E" ? value : value * -1;

      if (directionType === "lateral") {
        ship.moveWaypoint(amount, 0);
      } else {
        ship.moveWaypoint(0, amount);
      }
    } else {
      const degree = command === "R" ? value : value * -1;
      ship.rotateWaypoint(degree);
    }
  }

  return {
    shipNavigation,
    waypointNavigation,
    ship,
  };
}

module.exports = ShipController;
