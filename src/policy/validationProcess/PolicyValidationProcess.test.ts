import { PolicyValidationProcess } from "./PolicyValidationProcess.js";
import { LengthRule } from "../../rule/length/LengthRule.js";
import { CharPoolRule } from "../../rule/charpool/CharPoolRule.js";
import { beforeEach, describe, expect, test, vi } from "vitest";

const { loadZxcvbMock, validateMock } = vi.hoisted(() => ({
  loadZxcvbMock: vi.fn(),
  validateMock: vi.fn(),
}));

vi.mock("../../util/zxcvbn.js", () => ({
  loadZxcvb: loadZxcvbMock,
}));

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

  beforeEach(() => {
    loadZxcvbMock.mockReset();
    validateMock.mockReset();
    validateMock.mockResolvedValue({
      score: 4,
      feedback: { warning: null },
    });
    loadZxcvbMock.mockResolvedValue(validateMock);
  });

  test("returns expected results", async () => {
    const policyValidationProcess = new PolicyValidationProcess(
      "Varnish-Wilder-Overprice4",
      [lengthRule, containRule, containRule2],
      0,
    );

    const result = await policyValidationProcess.getResult();

    expect(loadZxcvbMock).not.toHaveBeenCalled();
    expect(result).toMatchInlineSnapshot(`
          {
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

  test("returns complexity when minComplexity is greater than zero", async () => {
    const policyValidationProcess = new PolicyValidationProcess(
      "Varnish-Wilder-Overprice4",
      [],
      1,
    );

    const result = await policyValidationProcess.getResult();

    expect(loadZxcvbMock).toHaveBeenCalledOnce();
    expect(validateMock).toHaveBeenCalledWith("Varnish-Wilder-Overprice4");
    expect(result).toEqual({
      isValid: true,
      ruleResults: [],
      complexity: {
        actual: 4,
        min: 1,
        warning: null,
      },
    });
  });

  test("rejects when a rule throws", async () => {
    const failingRule = new LengthRule({ min: 8 });
    vi.spyOn(failingRule, "validate").mockRejectedValue(
      new Error("rule validation failed"),
    );
    const policyValidationProcess = new PolicyValidationProcess("password", [
      failingRule,
    ]);

    await expect(policyValidationProcess.getResult()).rejects.toThrow(
      "rule validation failed",
    );
  });
});
