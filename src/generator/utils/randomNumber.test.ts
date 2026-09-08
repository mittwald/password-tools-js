import { describe, expect, test } from "vitest";
import {
  getRandomArrayIndex,
  getRandomArrayItem,
  getRandomNumber,
} from "./randomNumber.js";

describe("getRandomNumber", () => {
  test("rejects invalid bounds", () => {
    expect(() => getRandomNumber(5, 1)).toThrow(RangeError);
    expect(() => getRandomNumber(0.5, 10)).toThrow(RangeError);
    expect(() => getRandomNumber(0, Number.MAX_SAFE_INTEGER + 10)).toThrow(
      RangeError,
    );
  });

  test("returns the bound when min equals max", () => {
    expect(getRandomNumber(7, 7)).toBe(7);
  });

  // Accumulating bytes with "<<" overflows at four bytes and yields negative
  // numbers, so every magnitude the signature allows is covered here.
  test.each([
    ["single byte", 0, 9],
    ["two bytes", 0, 7775],
    ["exact power of two", 0, 255],
    ["three bytes", 0, 2 ** 24 - 1],
    ["four bytes", 0, 2 ** 24],
    ["five bytes", 0, 2 ** 32],
    ["negative bounds", -1000, -900],
    ["signature default", 0, Number.MAX_SAFE_INTEGER],
  ])("stays inside [min, max] for %s", (_label, min, max) => {
    for (let i = 0; i < 500; i++) {
      const value = getRandomNumber(min, max);
      expect(Number.isInteger(value)).toBe(true);
      expect(value).toBeGreaterThanOrEqual(min);
      expect(value).toBeLessThanOrEqual(max);
    }
  });

  test("is uniformly distributed", () => {
    const buckets = 90;
    const draws = buckets * 300;
    const counts = new Array<number>(buckets).fill(0);

    for (let i = 0; i < draws; i++) {
      counts[getRandomNumber(0, buckets - 1)]++;
    }

    const expected = draws / buckets;
    const chiSquared = counts.reduce(
      (sum, count) => sum + (count - expected) ** 2 / expected,
      0,
    );
    const degreesOfFreedom = buckets - 1;
    // Normal approximation; |z| < 5 leaves ample room for honest sampling noise
    // while still catching a systematically skewed generator.
    const z = (chiSquared - degreesOfFreedom) / Math.sqrt(2 * degreesOfFreedom);

    expect(Math.abs(z)).toBeLessThan(5);
    expect(counts.every((count) => count > 0)).toBe(true);
  });

  test("covers both ends of the range", () => {
    const seen = new Set<number>();
    for (let i = 0; i < 2000; i++) {
      seen.add(getRandomNumber(0, 3));
    }
    expect([...seen].sort()).toEqual([0, 1, 2, 3]);
  });
});

describe("getRandomArrayIndex / getRandomArrayItem", () => {
  test("indexes arrays and strings within bounds", () => {
    const array = ["a", "b", "c", "d"];
    for (let i = 0; i < 200; i++) {
      expect(array).toContain(getRandomArrayItem(array));
      expect(getRandomArrayIndex(array)).toBeLessThan(array.length);
      expect("xyz").toContain(getRandomArrayItem("xyz"));
    }
  });
});
