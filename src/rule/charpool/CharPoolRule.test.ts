import { CharPoolRule } from "./CharPoolRule.js";
import { RuleType } from "../declaration.js";
import { testRule } from "../lib/testRule";
import { describe } from "vitest";

describe(`${CharPoolRule.name}.validatePassword()`, () => {
    describe("min", () => {
        testRule(new CharPoolRule({ charPools: ["uppercase"], min: 3 }), [
            {
                pw: "QWErtz",
                result: {
                    charPools: [
                        {
                            charPool: "uppercase",
                            occurrences: 3,
                        },
                    ],
                    failingBoundary: undefined,
                    isValid: true,
                    ruleType: RuleType.charPool,
                    min: 3,
                    totalOccurrences: 3,
                },
            },
            {
                pw: "QWertz",
                result: {
                    charPools: [
                        {
                            charPool: "uppercase",
                            occurrences: 2,
                        },
                    ],
                    failingBoundary: "min",
                    isValid: false,
                    ruleType: RuleType.charPool,
                    min: 3,
                    totalOccurrences: 2,
                },
            },
        ]);
        testRule(new CharPoolRule({ charPools: ["numbers"], min: 3 }), [
            {
                pw: "xx123xx",
                result: {
                    charPools: [
                        {
                            charPool: "numbers",
                            occurrences: 3,
                        },
                    ],
                    failingBoundary: undefined,
                    isValid: true,
                    ruleType: RuleType.charPool,
                    min: 3,
                    totalOccurrences: 3,
                },
            },
            {
                pw: "xx12xx",
                result: {
                    charPools: [
                        {
                            charPool: "numbers",
                            occurrences: 2,
                        },
                    ],
                    failingBoundary: "min",
                    isValid: false,
                    ruleType: RuleType.charPool,
                    min: 3,
                    totalOccurrences: 2,
                },
            },
        ]);
        testRule(new CharPoolRule({ charPools: ["special"], min: 3 }), [
            {
                pw: "xx-#+xx",
                result: {
                    charPools: [
                        {
                            charPool: "special",
                            occurrences: 3,
                        },
                    ],
                    failingBoundary: undefined,
                    isValid: true,
                    ruleType: RuleType.charPool,
                    min: 3,
                    totalOccurrences: 3,
                },
            },
            {
                pw: "xx-#xx",
                result: {
                    charPools: [
                        {
                            charPool: "special",
                            occurrences: 2,
                        },
                    ],
                    failingBoundary: "min",
                    isValid: false,
                    ruleType: RuleType.charPool,
                    min: 3,
                    totalOccurrences: 2,
                },
            },
        ]);
        testRule(new CharPoolRule({ charPools: ["nonAscii"], min: 3 }), [
            {
                pw: "€®†asdf#+-345",
                result: {
                    charPools: [
                        {
                            charPool: "nonAscii",
                            occurrences: 3,
                        },
                    ],
                    failingBoundary: undefined,
                    isValid: true,
                    ruleType: RuleType.charPool,
                    min: 3,
                    totalOccurrences: 3,
                },
            },
            {
                pw: "€®asdf#+-345",
                result: {
                    charPools: [
                        {
                            charPool: "nonAscii",
                            occurrences: 2,
                        },
                    ],
                    failingBoundary: "min",
                    isValid: false,
                    ruleType: RuleType.charPool,
                    min: 3,
                    totalOccurrences: 2,
                },
            },
        ]);
    });
    describe("max", () => {
        testRule(new CharPoolRule({ charPools: ["lowercase"], max: 2 }), [
            {
                pw: "qwERTZ",
                result: {
                    charPools: [
                        {
                            charPool: "lowercase",
                            occurrences: 2,
                        },
                    ],
                    failingBoundary: undefined,
                    isValid: true,
                    ruleType: RuleType.charPool,
                    min: undefined,
                    max: 2,
                    totalOccurrences: 2,
                },
            },
            {
                pw: "qweRTZ",
                result: {
                    charPools: [
                        {
                            charPool: "lowercase",
                            occurrences: 3,
                        },
                    ],
                    failingBoundary: "max",
                    isValid: false,
                    ruleType: RuleType.charPool,
                    min: undefined,
                    max: 2,
                    totalOccurrences: 3,
                },
            },
        ]);
    });
    describe("default: min = 1, because neither min nor max defined", () => {
        testRule(new CharPoolRule({ charPools: ["lowercase"] }), [
            {
                pw: "qWERTZ",
                result: {
                    charPools: [
                        {
                            charPool: "lowercase",
                            occurrences: 1,
                        },
                    ],
                    failingBoundary: undefined,
                    isValid: true,
                    ruleType: RuleType.charPool,
                    min: 1,
                    totalOccurrences: 1,
                },
            },
            {
                pw: "QWERTZ",
                result: {
                    charPools: [
                        {
                            charPool: "lowercase",
                            occurrences: 0,
                        },
                    ],
                    failingBoundary: "min",
                    isValid: false,
                    ruleType: RuleType.charPool,
                    min: 1,
                    totalOccurrences: 0,
                },
            },
        ]);
    });
    describe("multiple charPools", () => {
        testRule(new CharPoolRule({ charPools: ["special", "numbers", "nonAscii"], min: 6 }), [
            {
                pw: "xx#12∂†Ωxx",
                result: {
                    charPools: [
                        {
                            charPool: "special",
                            occurrences: 1,
                        },
                        {
                            charPool: "numbers",
                            occurrences: 2,
                        },
                        {
                            charPool: "nonAscii",
                            occurrences: 3,
                        },
                    ],
                    failingBoundary: undefined,
                    isValid: true,
                    ruleType: RuleType.charPool,
                    min: 6,
                    totalOccurrences: 6,
                },
            },
            {
                pw: "xx#1∂†Ωxx",
                result: {
                    charPools: [
                        {
                            charPool: "special",
                            occurrences: 1,
                        },
                        {
                            charPool: "numbers",
                            occurrences: 1,
                        },
                        {
                            charPool: "nonAscii",
                            occurrences: 3,
                        },
                    ],
                    failingBoundary: "min",
                    isValid: false,
                    ruleType: RuleType.charPool,
                    min: 6,
                    totalOccurrences: 5,
                },
            },
        ]);
    });
});
