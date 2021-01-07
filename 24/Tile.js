"use strict";

class Tile {
  constructor([x, y]) {
    this.x = x;
    this.y = y;
  }

  get id() {
    return `${this.x}.${this.y}`;
  }

  get adjacentPositions() {
    return [
      [this.x + 2, this.y],
      [this.x - 2, this.y],

      [this.x + 1, this.y - 1],
      [this.x - 1, this.y - 1],

      [this.x + 1, this.y + 1],
      [this.x - 1, this.y + 1],
    ];
  }
}

module.exports = Tile;
