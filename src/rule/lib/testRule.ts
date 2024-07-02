import type { SyncRule, RuleValidationResult } from "../Rule.js";
import { describe, expect, test } from "vitest";

interface PasswordAndItsRuleResult {
    pw: string;
    result: RuleValidationResult;
}

export const testRule = (rule: SyncRule, testCases: PasswordAndItsRuleResult[]): void => {
    describe.each<PasswordAndItsRuleResult>(testCases)(`Rule: ${JSON.stringify(rule.config)}`, ({ pw, result }) => {
        test(`Password: '${pw}' -> ${result.isValid ? "✓" : "✗"}`, async () => {
            expect(await rule.validate(pw)).toStrictEqual(result);
        });
    });
};
