import { IS_POLICY_SYMBOL, Policy } from "./Policy.js";
import { RuleType } from "../rule/declaration.js";
import { describe, expect, test } from "vitest";
import testPolicyFull from "./../../test/policy_success/testPolicyFull.yaml?raw";
import { LengthRule } from "../rule/length/LengthRule";
import { PolicyDeclaration } from "./types";

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
  const policy = Policy.fromDeclaration(policyDecl);

  describe("toDeclaration", () => {
    test("can get declaration object", () => {
      expect(policy.toDeclaration()).toMatchInlineSnapshot(`
              {
                "minComplexity": 4,
                "rules": [
                  {
                    "min": 8,
                    "ruleType": "length",
                  },
                  {
                    "charPools": [
                      "special",
                    ],
                    "ruleType": "charPool",
                  },
                  {
                    "charPools": [
                      "numbers",
                    ],
                    "ruleType": "charPool",
                  },
                ],
              }
            `);
    });

    test("can create new policy from transferable", () => {
      const transferablePolicy = policy.toDeclaration();
      expect(() =>
        Policy.fromDeclaration(transferablePolicy),
      ).not.toThrowError();
    });
  });

  describe(Policy.fromDeclaration.name, () => {
    test("create policy from object", () => {
      expect(() => Policy.fromDeclaration(policyDecl)).not.toThrowError();
    });
    test("create policy from yaml string", () => {
      expect(() => Policy.fromDeclaration(testPolicyFull)).not.toThrowError();
    });
    test("create policy from class", () => {
      expect(() =>
        Policy.fromDeclaration(
          new Policy([
            new LengthRule({ min: 10 }),
            new LengthRule({ min: 20 }),
          ]),
        ),
      ).not.toThrowError();
    });
  });
  describe(Policy.isPolicy.name, () => {
    test("test policy by instanceOf", () => {
      const policy = new Policy([]);
      expect(() => Policy.isPolicy(policy)).toBeTruthy();
    });
    test("test policy by symbol", () => {
      const fakePolicy = { [IS_POLICY_SYMBOL]: true };
      expect(() => Policy.isPolicy(fakePolicy)).toBeTruthy();
    });
  });
  describe(Policy.assertValidDeclaration.name, () => {
    test("passes when given valid policy", () => {
      expect(() =>
        Policy.assertValidDeclaration(policyDecl),
      ).not.toThrowError();
    });
  });
  describe(policy.validate.name, () => {
    test("return ✓, when pw is valid", async () => {
      const result = await policy.validate("password-other-word-#1");
      expect(await result.isValid).toBeTruthy();
    });
    test("return ✗, when pw is invalid", async () => {
      const result = await policy.validate("passwor");
      expect(await result.isValid).toBeFalsy();
    });
    test("return ✗, when complexity is not acceptable", async () => {
      const result = await policy.validate("password#1");
      expect(await result.isValid).toBeFalsy();
    });
    test("has warning, when complexity is not acceptable", async () => {
      expect((await policy.validate("monkey123")).complexity.warning).toBe(
        "common",
      );
      expect((await policy.validate("password#1")).complexity.warning).toBe(
        "topTen",
      );
      expect((await policy.validate("verwaltung#1")).complexity.warning).toBe(
        "wordByItself",
      );
    });
  });
  describe("End-To-End", () => {
    test("validate a pw against examplePolicyFull.yaml", async () => {
      const policy = Policy.fromDeclaration(testPolicyFull);
      const result = await policy.validate("foo12");

      expect(result).toMatchInlineSnapshot(`
        {
          "complexity": {
            "actual": 0,
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
