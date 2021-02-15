"use strict";

const flip = (edge) => edge.split("").reverse().join("");

class Tile {
  constructor(_id, _edges, _data) {
    this.id = _id;
    this.rotation = 0;
    this.isFlipped = false;
    this.cache = new Map();

    const cacheKey = `${this.rotation}:${this.isFlipped}`;

    this.cache.set(cacheKey, {
      edges: Object.assign({}, _edges),
      data: [..._data],
    });

    const { edges, data } = this.cache.get(cacheKey);
    this.edges = edges;
    this.data = data;
  }

  get cacheKey() {
    return `${this.rotation}:${this.isFlipped}`;
  }

  get top() {
    return this.edges.top;
  }

  get right() {
    return this.edges.right;
  }

  get bottom() {
    return this.edges.bottom;
  }

  get left() {
    return this.edges.left;
  }

  getCachedEdgesAndData() {
    const { edges, data } = this.cache.get(this.cacheKey);
    this.edges = edges;
    this.data = data;
  }

  rotateEdgesAndData() {
    const {
      top: currentTop,
      right: currentRight,
      bottom: currentBottom,
      left: currentLeft,
    } = this.edges;

    const rotatedData = this.data.reduceRight((acc, line) => {
      line.split("").forEach((data, index) => {
        acc[index] = acc[index] ? acc[index] + data : data;
      });

      return acc;
    }, []);

    return {
      edges: {
        top: flip(currentLeft),
        right: currentTop,
        bottom: flip(currentRight),
        left: currentBottom,
      },
      data: rotatedData,
    };
  }

  flipEdgesAndData() {
    const {
      top: currentTop,
      right: currentRight,
      bottom: currentBottom,
      left: currentLeft,
    } = this.edges;

    const flippedData = this.data.map((line) => flip(line));

    return {
      edges: {
        top: flip(currentTop),
        right: currentLeft,
        bottom: flip(currentBottom),
        left: currentRight,
      },
      data: flippedData,
    };
  }

  rotate() {
    this.rotation = (this.rotation + 90 + 360) % 360;
    if (this.cache.has(this.cacheKey)) {
      this.getCachedEdgesAndData();
    } else {
      const { edges, data } = this.rotateEdgesAndData();
      this.cache.set(this.cacheKey, { edges, data });
      this.edges = edges;
      this.data = data;
    }
  }

  flip() {
    this.isFlipped = !this.isFlipped;

    if (this.cache.has(this.cacheKey)) {
      this.getCachedEdgesAndData();
    } else {
      const { edges, data } = this.flipEdgesAndData();
      this.cache.set(this.cacheKey, { edges, data });
      this.edges = edges;
      this.data = data;
    }
  }
}

module.exports = Tile;
