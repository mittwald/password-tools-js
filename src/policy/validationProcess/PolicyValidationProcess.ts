import type { Rule } from "../../rule/Rule.js";
import type { PolicyValidationResult } from "../Policy.js";
import { loadZxcvb } from "../../util/zxcvbn.js";
import type { ComplexityScore } from "../types.js";

export class PolicyValidationProcess {
  public readonly rules: Array<Rule> = [];
  public readonly pw: string;
  public readonly minComplexity: ComplexityScore;

  public constructor(pw: string, rules: Rule[],  minComplexity: ComplexityScore = 0) {
    this.pw = pw;
    this.rules = rules;
    this.minComplexity = minComplexity;
  }

  private async calculateComplexity(): Promise<ComplexityScore> {
    return new Promise((resolve) => {
      setTimeout(async () => {
        const validate = await loadZxcvb();
        const { score } = await validate(this.pw);
        resolve(score);
      }, 0);
    });
  }

  public async getResult(): Promise<PolicyValidationResult> {
    return new Promise((resolve) => {
      setTimeout(async () => {
        const validate = await loadZxcvb();
        const complexityResult = await validate(this.pw);
        const actualComplexityScore = complexityResult.score;
        const acceptableComplexity =
          actualComplexityScore >= this.minComplexity;

        const results = await Promise.all(this.rules.map(r => r.validate(this.pw)))
        const isValid =
          acceptableComplexity && results.every((r) => r.isValid);

        resolve({
          isValid,
          ruleResults: results,
          complexity: {
            actual: actualComplexityScore,
            min: this.minComplexity,
            warning: complexityResult.feedback.warning,
          },
        });
      }, 0);
    });
  }
}
