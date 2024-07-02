import type { RuleValidationResult } from "../Rule.js";
import { SyncRule } from "../Rule.js";
import { valueObeysMinAndMax } from "../lib/valueObeysMinAndMax.js";
import type { LengthConfig } from "./declaration.js";
import { RuleType } from "../declaration.js";

interface ResultContext {
    length: number;
    ruleType: RuleType.length;
}

export type LengthResult = LengthConfig & ResultContext;

export class LengthRule extends SyncRule<LengthConfig, ResultContext> {
    public validate(pw: string): RuleValidationResult<LengthResult> {
        const { min, max } = this.config;

        const length = pw.length;
        const isValid = valueObeysMinAndMax(length, { min, max });

        return {
            isValid: isValid === true,
            failingBoundary: isValid === true ? undefined : isValid,
            length,
            ruleType: RuleType.length,
            ...this.config,
        };
    }
}
