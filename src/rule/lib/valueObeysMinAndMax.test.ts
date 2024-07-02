import { valueObeysMinAndMax } from "./valueObeysMinAndMax.js";
import { describe, expect, test } from "vitest";

interface TestCase {
    value: number;
    min: number | undefined;
    max: number | undefined;
    expected: boolean;
}

describe(valueObeysMinAndMax.name, () => {
    describe.each`
        value | min          | max          | expected
        ${0}  | ${1}         | ${3}         | ${"min"}
        ${1}  | ${1}         | ${3}         | ${true}
        ${2}  | ${1}         | ${3}         | ${true}
        ${3}  | ${1}         | ${3}         | ${true}
        ${4}  | ${1}         | ${3}         | ${"max"}
        ${0}  | ${1}         | ${undefined} | ${"min"}
        ${1}  | ${1}         | ${undefined} | ${true}
        ${2}  | ${1}         | ${undefined} | ${true}
        ${2}  | ${undefined} | ${3}         | ${true}
        ${3}  | ${undefined} | ${3}         | ${true}
        ${4}  | ${undefined} | ${3}         | ${"max"}
        ${0}  | ${undefined} | ${undefined} | ${true}
        ${2}  | ${3}         | ${1}         | ${"min"}
    `("be expected | value, min, max", ({ value, min, max, expected }: TestCase) => {
        test(`return ${expected} | ${value}, ${min}, ${max}`, () => {
            expect(valueObeysMinAndMax(value, { min, max })).toBe(expected);
        });
    });
});
