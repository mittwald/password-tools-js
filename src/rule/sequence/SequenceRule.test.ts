import { SequenceRule } from "./SequenceRule.js";
import { SequenceType } from "./declaration.js";
import { RuleType } from "../declaration.js";
import { testRule } from "../lib/testRule";
import { describe, expect, test } from "vitest";

interface TestCase {
    validSequences: string[];
    invalidSequences: string[];
    maxLength?: number;
}

const testBySequenceTypes = (sequenceType: SequenceType, testCases: TestCase[]): void => {
    describe(sequenceType, () => {
        for (const testCase of testCases) {
            const { validSequences, invalidSequences } = testCase;
            const maxLength = testCase.maxLength ?? 3;

            const validPw = `x_${validSequences}_x`;
            const invalidPw = `x_${invalidSequences}_x`;

            test(`✓ pw: '${validPw}' -> contains no ${sequenceType}-sequence exceeding maxLength: ${maxLength}`, () => {
                const result = new SequenceRule({ sequences: [sequenceType], maxLength }).validate(validPw);
                expect(result).toStrictEqual({
                    ruleType: RuleType.sequence,
                    isValid: true,
                    sequences: [
                        {
                            type: sequenceType,
                            found: [],
                        },
                    ],
                    maxLength,
                });
            });
            test(`✗ pw: '${invalidPw}' -> contains ${sequenceType}-sequence/s: '${invalidSequences}' exceeding maxLength: ${maxLength}`, () => {
                const result = new SequenceRule({ sequences: [sequenceType], maxLength }).validate(invalidPw);
                expect(result).toStrictEqual({
                    ruleType: RuleType.sequence,
                    isValid: false,
                    sequences: [
                        {
                            type: sequenceType,
                            found: invalidSequences,
                        },
                    ],
                    maxLength,
                });
            });
        }
    });
};

describe(`${SequenceRule.name}.validatePassword()`, () => {
    describe("default maxLength = 3", () => {
        testBySequenceTypes(SequenceType.repeat, [{ validSequences: ["333"], invalidSequences: ["4444"] }]);
        testBySequenceTypes(SequenceType.keyboard, [{ validSequences: ["asd"], invalidSequences: ["asdf"] }]);
        testBySequenceTypes(SequenceType.number, [{ validSequences: ["123"], invalidSequences: ["1234"] }]);
        testBySequenceTypes(SequenceType.alphabet, [{ validSequences: ["abc"], invalidSequences: ["abcd"] }]);
    });
    describe("maxLength", () => {
        testBySequenceTypes(SequenceType.repeat, [{ validSequences: ["22"], invalidSequences: ["333"], maxLength: 2 }]);
    });
    describe("multiple sequenceTypes", () => {
        testRule(new SequenceRule({ sequences: [SequenceType.alphabet, SequenceType.keyboard] }), [
            {
                pw: "_asd_abc_",
                result: {
                    ruleType: RuleType.sequence,
                    isValid: true,
                    sequences: [
                        {
                            type: SequenceType.alphabet,
                            found: [],
                        },
                        {
                            type: SequenceType.keyboard,
                            found: [],
                        },
                    ],
                    maxLength: 3,
                },
            },
            {
                pw: "_asdf_abcd_lmnop_",
                result: {
                    ruleType: RuleType.sequence,
                    isValid: false,
                    sequences: [
                        {
                            type: SequenceType.alphabet,
                            found: ["abcd", "lmnop"],
                        },
                        {
                            type: SequenceType.keyboard,
                            found: ["asdf"],
                        },
                    ],
                    maxLength: 3,
                },
            },
            {
                pw: "_abcd_lmnop_",
                result: {
                    ruleType: RuleType.sequence,
                    isValid: false,
                    sequences: [
                        {
                            type: SequenceType.alphabet,
                            found: ["abcd", "lmnop"],
                        },
                        {
                            type: SequenceType.keyboard,
                            found: [],
                        },
                    ],
                    maxLength: 3,
                },
            },
        ]);
    });
    describe("passwords as raw sequences, without pre- or suffixes", () => {
        test("repeat", () => {
            const result = new SequenceRule({ sequences: [SequenceType.repeat] }).validate("aaaa");
            expect(result).toStrictEqual({
                ruleType: RuleType.sequence,
                isValid: false,
                sequences: [
                    {
                        type: SequenceType.repeat,
                        found: ["aaaa"],
                    },
                ],
                maxLength: 3,
            });
        });
    });
});
