import type { Rule, RuleValidationResult } from "../../rule/Rule.js";
import type { PolicyValidationResult } from "../Policy.js";
import { loadZxcvb } from "../../util/zxcvbn.js";
import type { ComplexityScore } from "../types.js";

export class PolicyValidationProcess {
  public readonly ruleResults: Array<RuleValidationResult> = [];
  public readonly pw: string;
  public readonly minComplexity: ComplexityScore;

  public constructor(pw: string, minComplexity: ComplexityScore = 0) {
    this.pw = pw;
    this.minComplexity = minComplexity;
  }

  public async validateRules(rules: Rule[]) {
    for (const rule of rules) {
      this.ruleResults.push(await rule.validate(this.pw));
    }
  }

  public async allRulesAreSatisfied() {
    return Promise.all(this.ruleResults);
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
        const allRulesAreSatisfied = await this.allRulesAreSatisfied();

        const isValid =
          acceptableComplexity && allRulesAreSatisfied.every((r) => r.isValid);

        resolve({
          isValid,
          ruleResults: allRulesAreSatisfied,
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
