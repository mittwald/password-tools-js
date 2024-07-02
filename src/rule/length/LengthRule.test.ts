import { LengthRule } from "./LengthRule.js";
import { RuleType } from "../declaration.js";
import { describe, expect, test } from "vitest";

describe(`${LengthRule.name}.validatePassword()`, () => {
    test("pw is too short", () => {
        const result = new LengthRule({ min: 5 }).validate("1234");
        expect(result).toStrictEqual({
            failingBoundary: "min",
            isValid: false,
            length: 4,
            min: 5,
            ruleType: RuleType.length,
        });
    });
    test("pw is too long", () => {
        const result = new LengthRule({ max: 5 }).validate("123456");
        expect(result).toStrictEqual({
            failingBoundary: "max",
            isValid: false,
            length: 6,
            max: 5,
            ruleType: RuleType.length,
        });
    });
    test("pw length is exactly correct", () => {
        const result = new LengthRule({ min: 5, max: 5 }).validate("12345");
        expect(result).toStrictEqual({
            failingBoundary: undefined,
            isValid: true,
            length: 5,
            min: 5,
            max: 5,
            ruleType: RuleType.length,
        });
    });
    test("returns valid if no config provided", () => {
        const result = new LengthRule({}).validate("12345");
        expect(result).toStrictEqual({
            failingBoundary: undefined,
            isValid: true,
            length: 5,
            ruleType: RuleType.length,
        });
    });
});
