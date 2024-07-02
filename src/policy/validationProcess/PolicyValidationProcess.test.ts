import { PolicyValidationProcess } from "./PolicyValidationProcess.js";
import { LengthRule } from "../../rule/length/LengthRule.js";
import { CharPoolRule } from "../../rule/charpool/CharPoolRule.js";
import { HibpRule } from "../../rule/hibp/HibpRule.js";
import { describe, expect, test } from "vitest";

describe(PolicyValidationProcess.name, () => {
    const lengthRule = new LengthRule({ min: 8 });
    const containRule = new CharPoolRule({
        charPools: ["numbers", "uppercase"],
        min: 3,
    });
    const containRule2 = new CharPoolRule({
        charPools: ["special", "nonAscii"],
        min: 2,
    });
    const hibpRule = new HibpRule({});

    test("returns expected results", () => {
        const policyValidationProcess = new PolicyValidationProcess("Varnish-Wilder-Overprice4");

        policyValidationProcess.validateRules([lengthRule, containRule, containRule2]);
        const result = policyValidationProcess.getResult();

        expect(result).toMatchInlineSnapshot(`
          {
            "complexity": {
              "actual": 4,
              "min": 0,
              "warning": null,
            },
            "isValid": true,
            "ruleResults": [
              {
                "failingBoundary": undefined,
                "isValid": true,
                "length": 25,
                "min": 8,
                "ruleType": "length",
              },
              {
                "charPools": [
                  {
                    "charPool": "numbers",
                    "occurrences": 1,
                  },
                  {
                    "charPool": "uppercase",
                    "occurrences": 3,
                  },
                ],
                "failingBoundary": undefined,
                "isValid": true,
                "min": 3,
                "ruleType": "charPool",
                "totalOccurrences": 4,
              },
              {
                "charPools": [
                  {
                    "charPool": "special",
                    "occurrences": 2,
                  },
                  {
                    "charPool": "nonAscii",
                    "occurrences": 0,
                  },
                ],
                "failingBoundary": undefined,
                "isValid": true,
                "min": 2,
                "ruleType": "charPool",
                "totalOccurrences": 2,
              },
            ],
          }
        `);
    });
    test("returns expected results when validating AsyncRule", async () => {
        const policyValidationProcess = new PolicyValidationProcess("Varnish-Wilder-Overprice4");

        policyValidationProcess.validateRules([lengthRule, hibpRule]);
        const result = policyValidationProcess.getResult();

        expect(result).toMatchInlineSnapshot(`
          {
            "complexity": {
              "actual": 4,
              "min": 0,
              "warning": null,
            },
            "isValid": Promise {},
            "ruleResults": [
              {
                "failingBoundary": undefined,
                "isValid": true,
                "length": 25,
                "min": 8,
                "ruleType": "length",
              },
              Promise {},
            ],
          }
        `);
        expect(await result.isValid).toBeTruthy();
    });
});
