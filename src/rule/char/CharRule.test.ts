import { CharRule } from "./CharRule.js";
import { RuleType } from "../declaration.js";
import { testRule } from "../lib/testRule";
import { describe } from "vitest";

describe(`${CharRule.name}.validatePassword()`, () => {
    describe("max", () => {
        testRule(new CharRule({ chars: "@$", max: 3 }), [
            {
                pw: "_@@$_",
                result: {
                    chars: [
                        {
                            char: "@",
                            occurrences: 2,
                        },
                        {
                            char: "$",
                            occurrences: 1,
                        },
                    ],
                    failingBoundary: undefined,
                    isValid: true,
                    ruleType: RuleType.char,
                    min: undefined,
                    max: 3,
                    totalOccurrences: 3,
                },
            },
            {
                pw: "_$$$@_",
                result: {
                    chars: [
                        {
                            char: "@",
                            occurrences: 1,
                        },
                        {
                            char: "$",
                            occurrences: 3,
                        },
                    ],
                    failingBoundary: "max",
                    isValid: false,
                    ruleType: RuleType.char,
                    min: undefined,
                    max: 3,
                    totalOccurrences: 4,
                },
            },
        ]);
    });
    describe("min", () => {
        testRule(new CharRule({ chars: "#!", min: 3 }), [
            {
                pw: "_##!_",
                result: {
                    chars: [
                        {
                            char: "#",
                            occurrences: 2,
                        },
                        {
                            char: "!",
                            occurrences: 1,
                        },
                    ],
                    failingBoundary: undefined,
                    isValid: true,
                    ruleType: RuleType.char,
                    min: 3,
                    totalOccurrences: 3,
                },
            },
            {
                pw: "_#!_",
                result: {
                    chars: [
                        {
                            char: "#",
                            occurrences: 1,
                        },
                        {
                            char: "!",
                            occurrences: 1,
                        },
                    ],
                    failingBoundary: "min",
                    isValid: false,
                    ruleType: RuleType.char,
                    min: 3,
                    totalOccurrences: 2,
                },
            },
        ]);
    });
    describe("default: min = 1, if neither min nor max defined", () => {
        testRule(new CharRule({ chars: "$%" }), [
            {
                pw: "_$_",
                result: {
                    chars: [
                        {
                            char: "$",
                            occurrences: 1,
                        },
                        {
                            char: "%",
                            occurrences: 0,
                        },
                    ],
                    failingBoundary: undefined,
                    isValid: true,
                    ruleType: RuleType.char,
                    min: 1,
                    totalOccurrences: 1,
                },
            },
            {
                pw: "_foo_",
                result: {
                    chars: [
                        {
                            char: "$",
                            occurrences: 0,
                        },
                        {
                            char: "%",
                            occurrences: 0,
                        },
                    ],
                    failingBoundary: "min",
                    isValid: false,
                    ruleType: RuleType.char,
                    min: 1,
                    totalOccurrences: 0,
                },
            },
        ]);
    });
});
