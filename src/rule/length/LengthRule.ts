import { RuleType, RuleValidationResult } from "../Rule.js";
import { SyncRule } from "../Rule.js";
import { valueObeysMinAndMax } from "../lib/valueObeysMinAndMax.js";
import type { LengthConfig } from "./declaration.js";

export type ResultContext = {
  length: number;
  ruleType: typeof RuleType.length;
};

export type LengthResult = LengthConfig & ResultContext;

export class LengthRule extends SyncRule<
  typeof RuleType.length,
  LengthConfig,
  ResultContext
> {
  ruleType = RuleType.length;

  public validate(pw: string): RuleValidationResult<LengthResult> {
    const { min = 16, max } = this.config;

    const length = pw.length;
    const isValid = valueObeysMinAndMax(length, { min, max });

    return {
      isValid: isValid === true,
      failingBoundary: isValid === true ? undefined : isValid,
      length,
      ruleType: this.ruleType,
      ...this.config,
    };
  }
}
