import type { Rule, RuleValidationResult } from "../../rule/Rule.js";
import type { PolicyValidationResult } from "../Policy.js";
import type { ComplexityScore } from "../declaration.js";
import zxcvbn from "../../util/zxcvbn.js";

export class PolicyValidationProcess {
    public readonly ruleResults: Array<RuleValidationResult | Promise<RuleValidationResult>> = [];
    public readonly pw: string;
    public readonly minComplexity: ComplexityScore;

    public constructor(pw: string, minComplexity: ComplexityScore = 0) {
        this.pw = pw;
        this.minComplexity = minComplexity;
    }

    public validateRules(rules: Rule[]): void {
        rules.forEach((rule) => this.ruleResults.push(rule.validate(this.pw)));
    }

    public allRulesAreSatisfied(): Promise<boolean> | boolean {
        const areSatisfied = (results: RuleValidationResult[]): boolean => results.every((r) => r.isValid);

        const results = this.ruleResults;
        if (PolicyValidationProcess.allResultsAreSync(this.ruleResults)) {
            return areSatisfied(this.ruleResults);
        } else {
            return Promise.all(results).then(areSatisfied);
        }
    }

    private calculateComplexity(): ComplexityScore {
        const { score } = zxcvbn(this.pw);
        return score;
    }

    public getResult(): PolicyValidationResult {
        const complexityResult = zxcvbn(this.pw);
        const actualComplexityScore = complexityResult.score;
        const acceptableComplexity = actualComplexityScore >= this.minComplexity;
        const allRulesAreSatisfied = this.allRulesAreSatisfied();

        const isValid =
            allRulesAreSatisfied instanceof Promise
                ? allRulesAreSatisfied.then((r) => r && acceptableComplexity)
                : allRulesAreSatisfied && acceptableComplexity;

        return {
            isValid,
            ruleResults: this.ruleResults,
            complexity: {
                actual: actualComplexityScore,
                min: this.minComplexity,
                warning: complexityResult.feedback.warning,
            },
        };
    }

    private static allResultsAreSync(
        results: Array<RuleValidationResult | Promise<RuleValidationResult>>,
    ): results is RuleValidationResult[] {
        return results.every((r) => !(r instanceof Promise));
    }
}
