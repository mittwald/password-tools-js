import type { SyncRule, RuleValidationResult } from "../Rule.js";
import { describe, expect, test } from "vitest";

interface PasswordAndItsRuleResult {
    pw: string;
    result: RuleValidationResult;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const testRule = (rule: SyncRule<any>, testCases: PasswordAndItsRuleResult[]): void => {
    describe.each<PasswordAndItsRuleResult>(testCases)(`Rule: ${JSON.stringify(rule.config)}`, ({ pw, result }) => {
        test(`Password: '${pw}' -> ${result.isValid ? "✓" : "✗"}`, async () => {
            expect(rule.validate(pw)).toStrictEqual(result);
        });
    });
};
