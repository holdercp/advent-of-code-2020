"use strict";

class Cube {
  constructor([x = 0, y = 0, z = 0, w]) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  get id() {
    return this.w !== undefined
      ? `${this.x}.${this.y}.${this.z}.${this.w}`
      : `${this.x}.${this.y}.${this.z}`;
  }
}

module.exports = Cube;
