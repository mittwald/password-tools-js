import type { RuleValidationResult } from "../Rule.js";
import { SyncRule } from "../Rule.js";
import type { RegexConfig } from "./declaration.js";
import { RuleType } from "../declaration.js";
import { createRegExp } from "./lib/createRegExp.js";
import { valueObeysMinAndMax } from "../lib/valueObeysMinAndMax.js";

export type RegexContext = {
    ruleType: typeof RuleType.regex;
    matches: number;
};

export type RegexResult = RegexContext & RegexConfig;

export class RegexRule extends SyncRule<typeof RuleType.regex, RegexConfig, RegexContext> {
    ruleType = RuleType.regex;

    public validate(pw: string): RuleValidationResult<RegexResult> {
        const { max, pattern, flags } = this.config;
        const min = this.config.min === undefined && max === undefined ? 1 : this.config.min;

        const regExp = createRegExp(pattern, flags, true);
        const matches = pw.match(regExp)?.length ?? 0;

        const isValid = valueObeysMinAndMax(matches, { min, max });

        return {
            isValid: isValid === true,
            failingBoundary: isValid === true ? undefined : isValid,
            ruleType: this.ruleType,
            matches,
            ...this.config,
            min,
        };
    }
}
