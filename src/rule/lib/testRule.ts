import type { Rule, RuleValidationResult } from "../Rule.js";
import { describe, expect, test } from "vitest";

interface PasswordAndItsRuleResult {
  pw: string;
  result: RuleValidationResult;
}

export const testRule = (
  rule: Rule,
  testCases: PasswordAndItsRuleResult[],
): void => {
  describe.each<PasswordAndItsRuleResult>(testCases)(
    `Rule: ${JSON.stringify(rule.config)}`,
    async ({ pw, result }) => {
      test(`Password: '${pw}' -> ${result.isValid ? "✓" : "✗"}`, async () => {
        expect(await rule.validate(pw)).toStrictEqual(result);
      });
    },
  );
};
