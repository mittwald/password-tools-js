import { RegexRule } from "./RegexRule.js";
import { RuleType } from "../declaration.js";
import { testRule } from "../lib/testRule";
import { describe } from "vitest";

describe(`${RegexRule.name}.validatePassword()`, () => {
    describe("min", () => {
        testRule(new RegexRule({ pattern: "[ -~]", translationKey: "printableAscii", min: 3 }), [
            {
                pw: "»12«",
                result: {
                    failingBoundary: "min",
                    isValid: false,
                    matches: 2,
                    min: 3,
                    pattern: "[ -~]",
                    ruleType: RuleType.regex,
                    translationKey: "printableAscii",
                },
            },
            {
                pw: "»123«",
                result: {
                    failingBoundary: undefined,
                    isValid: true,
                    matches: 3,
                    min: 3,
                    pattern: "[ -~]",
                    ruleType: RuleType.regex,
                    translationKey: "printableAscii",
                },
            },
        ]);
    });
    describe("max", () => {
        testRule(new RegexRule({ pattern: "[,.-]", translationKey: "matchesCommaDotMinus", max: 2 }), [
            {
                pw: "_.,._",
                result: {
                    failingBoundary: "max",
                    isValid: false,
                    matches: 3,
                    min: undefined,
                    max: 2,
                    pattern: "[,.-]",
                    ruleType: RuleType.regex,
                    translationKey: "matchesCommaDotMinus",
                },
            },
            {
                pw: "_,,_",
                result: {
                    failingBoundary: undefined,
                    isValid: true,
                    matches: 2,
                    min: undefined,
                    max: 2,
                    pattern: "[,.-]",
                    ruleType: RuleType.regex,
                    translationKey: "matchesCommaDotMinus",
                },
            },
        ]);
    });
    describe("default: min = 1, if neither min nor max are defined", () => {
        testRule(new RegexRule({ pattern: "\\d", translationKey: "digits" }), [
            {
                pw: "_foo_",
                result: {
                    failingBoundary: "min",
                    isValid: false,
                    matches: 0,
                    min: 1,
                    pattern: "\\d",
                    ruleType: RuleType.regex,
                    translationKey: "digits",
                },
            },
            {
                pw: "_1_",
                result: {
                    failingBoundary: undefined,
                    isValid: true,
                    matches: 1,
                    min: 1,
                    pattern: "\\d",
                    ruleType: RuleType.regex,
                    translationKey: "digits",
                },
            },
        ]);
    });
    describe("different regExp", () => {
        describe("start with an 'a'", () => {
            testRule(new RegexRule({ pattern: "^a" }), [
                {
                    pw: "»12«",
                    result: {
                        failingBoundary: "min",
                        isValid: false,
                        matches: 0,
                        min: 1,
                        pattern: "^a",
                        ruleType: RuleType.regex,
                    },
                },
                {
                    pw: "a»123«",
                    result: {
                        failingBoundary: undefined,
                        isValid: true,
                        matches: 1,
                        min: 1,
                        pattern: "^a",
                        ruleType: RuleType.regex,
                    },
                },
                {
                    pw: "a",
                    result: {
                        failingBoundary: undefined,
                        isValid: true,
                        matches: 1,
                        min: 1,
                        pattern: "^a",
                        ruleType: RuleType.regex,
                    },
                },
            ]);
        });
    });
});
