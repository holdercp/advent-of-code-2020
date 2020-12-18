"use strict";

class Cube {
  constructor([x = 0, y = 0, z = 0, w]) {
    if (Number.isNaN(y)) {
      console.log();
    }
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;

    this.activeNeighborCount = 0;
  }

  get id() {
    return this.w
      ? `${this.x}.${this.y}.${this.z}.${this.w}`
      : `${this.x}.${this.y}.${this.z}`;
  }

  incrementActiveNeighborCount() {
    this.activeNeighborCount += 1;
  }

  resetActiveNeighborCount() {
    this.activeNeighborCount = 0;
  }
}

module.exports = Cube;
