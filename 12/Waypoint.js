"use strict";

function Waypoint(initialX, initialY) {
  let x = initialX;
  let y = initialY;

  function getPosition() {
    return [x, y];
  }

  function setPosition(newX, newY) {
    x = newX;
    y = newY;
  }

  function move(xAmount, yAmount) {
    x += xAmount;
    y += yAmount;
  }

  return {
    getPosition,
    setPosition,
    move,
  };
}

module.exports = Waypoint;
