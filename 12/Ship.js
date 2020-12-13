"use strict";

const Waypoint = require("./Waypoint");
const rotate = require("./rotate");

const degreeMap = new Map([
  [0, "N"],
  [90, "E"],
  [180, "S"],
  [270, "W"],
]);

function Ship() {
  let bearing = 90;
  let x = 0;
  let y = 0;

  const waypoint = Waypoint(x + 10, y + 1);

  function getDirection() {
    return degreeMap.get(bearing);
  }

  function getPosition() {
    return [x, y];
  }

  function changeBearing(degree) {
    bearing = (bearing + degree + 360) % 360;
  }

  function move(xAmount, yAmount) {
    x += xAmount;
    y += yAmount;
  }

  function moveX(xAmount) {
    x += xAmount;
  }

  function moveY(yAmount) {
    y += yAmount;
  }

  function moveWaypoint(xAmount, yAmount) {
    waypoint.move(xAmount, yAmount);
  }

  function rotateWaypoint(degree) {
    const [waypointX, waypointY] = waypoint.getPosition();
    const [newX, newY] = rotate(x, y, waypointX, waypointY, degree);
    waypoint.setPosition(newX, newY);
  }

  function moveToWaypoint(times) {
    const [waypointX, waypointY] = waypoint.getPosition();
    const xDifference = waypointX - x;
    const yDifference = waypointY - y;
    const shipX = xDifference * times;
    const shipY = yDifference * times;
    move(shipX, shipY);
    waypoint.setPosition(x + xDifference, y + yDifference);
  }

  return {
    getDirection,
    getPosition,
    changeBearing,
    move,
    moveX,
    moveY,
    moveToWaypoint,
    moveWaypoint,
    rotateWaypoint,
  };
}

module.exports = Ship;
