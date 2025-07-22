import { Policy } from "./Policy.js";
import type { PolicyDeclaration } from "./declaration.js";
import { RuleType } from "../rule/declaration.js";
import { describe, expect, test } from "vitest";
import testPolicyFull from "./../../test/policy_success/testPolicyFull.yaml?raw";
import { LengthRule } from "../rule/length/LengthRule";

const policyDecl: PolicyDeclaration = {
    minComplexity: 4,
    rules: [
        {
            ruleType: RuleType.length,
            min: 8,
        },
        {
            ruleType: RuleType.charPool,
            charPools: ["special"],
        },
        {
            ruleType: RuleType.charPool,
            charPools: ["numbers"],
        },
    ],
};

describe(Policy.name, () => {
    const policy = Policy.fromData(policyDecl);

    describe(Policy.fromData.name, () => {
        test("create policy from object", () => {
            expect(() => Policy.fromData(policyDecl)).not.toThrowError();
        });
        test("create policy from yaml string", () => {
            expect(() => Policy.fromData(testPolicyFull)).not.toThrowError();
        });
        test("create policy from class", () => {
            expect(() =>
                Policy.fromData(new Policy([new LengthRule({ min: 10 }), new LengthRule({ min: 20 })])),
            ).not.toThrowError();
        });
    });
    describe(Policy.assertValidDeclaration.name, () => {
        test("passes when given valid policy", () => {
            expect(() => Policy.assertValidDeclaration(policyDecl)).not.toThrowError();
        });
    });
    describe(policy.validate.name, () => {
        test("return ✓, when pw is valid", async () => {
            const result = policy.validate("password-other-word-#1");
            expect(await result.isValid).toBeTruthy();
        });
        test("return ✗, when pw is invalid", async () => {
            const result = policy.validate("passwor");
            expect(await result.isValid).toBeFalsy();
        });
        test("return ✗, when complexity is not acceptable", async () => {
            const result = policy.validate("password#1");
            expect(await result.isValid).toBeFalsy();
        });
        test("has warning, when complexity is not acceptable", () => {
            const result = policy.validate("password#1");
            expect(result.complexity.warning).toBe("similarToCommon");
        });
    });
    describe("End-To-End", () => {
        test("validate a pw against examplePolicyFull.yaml", () => {
            const policy = Policy.fromData(testPolicyFull);
            const result = policy.validate("foo12");

            expect(result).toMatchInlineSnapshot(`
              {
                "complexity": {
                  "actual": 1,
                  "min": 0,
                  "warning": null,
                },
                "isValid": false,
                "ruleResults": [
                  {
                    "failingBoundary": "min",
                    "isValid": false,
                    "length": 5,
                    "max": 64,
                    "min": 8,
                    "ruleType": "length",
                  },
                  {
                    "failingBoundary": undefined,
                    "isValid": true,
                    "matches": 0,
                    "max": 0,
                    "min": undefined,
                    "pattern": "^\\.",
                    "ruleType": "regex",
                    "translationKey": "beginsWithDot",
                  },
                  {
                    "charPools": [
                      {
                        "charPool": "special",
                        "occurrences": 0,
                      },
                      {
                        "charPool": "numbers",
                        "occurrences": 2,
                      },
                    ],
                    "failingBoundary": "min",
                    "isValid": false,
                    "min": 3,
                    "ruleType": "charPool",
                    "totalOccurrences": 2,
                  },
                  {
                    "chars": [
                      {
                        "char": "#",
                        "occurrences": 0,
                      },
                      {
                        "char": "!",
                        "occurrences": 0,
                      },
                    ],
                    "failingBoundary": "min",
                    "isValid": false,
                    "min": 1,
                    "ruleType": "char",
                    "totalOccurrences": 0,
                  },
                  {
                    "blockedSubstrings": undefined,
                    "isValid": true,
                    "ruleType": "blocklist",
                    "substringMatch": true,
                  },
                ],
              }
            `);
        });
    });
});
