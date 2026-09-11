import type { Rule } from "../../rule/Rule.js";
import type { PolicyValidationResult } from "../Policy.js";
import { loadZxcvb } from "../../util/zxcvbn.js";
import type { ComplexityScore } from "../types.js";

export class PolicyValidationProcess {
  public readonly rules: Array<Rule> = [];
  public readonly pw: string;
  public readonly minComplexity: ComplexityScore;

  public constructor(
    pw: string,
    rules: Rule[],
    minComplexity: ComplexityScore = 0,
  ) {
    this.pw = pw;
    this.rules = rules;
    this.minComplexity = minComplexity;
  }

  public async getResult(): Promise<PolicyValidationResult> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        void this.calculateResult().then(resolve, reject);
      }, 0);
    });
  }

  private async calculateResult(): Promise<PolicyValidationResult> {
    let complexity: PolicyValidationResult["complexity"];
    let acceptableComplexity = true;

    if (this.minComplexity > 0) {
      const validate = await loadZxcvb();
      const complexityResult = await validate(this.pw);
      const actualComplexityScore = complexityResult.score;
      acceptableComplexity = actualComplexityScore >= this.minComplexity;
      complexity = {
        actual: actualComplexityScore,
        min: this.minComplexity,
        warning: complexityResult.feedback.warning,
      };
    }

    const results = await Promise.all(
      this.rules.map((r) => r.validate(this.pw)),
    );
    const isValid = acceptableComplexity && results.every((r) => r.isValid);

    return {
      isValid,
      ruleResults: results,
      ...(complexity && { complexity }),
    };
  }
}
