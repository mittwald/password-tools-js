import { AnyRuleDeclaration } from "../rule/declaration";

/**
 * Discrete complexity score required by a policy.
 *
 * The higher the value, the stronger (more complex) the password is expected to
 * be. Consumers typically compute a password's complexity (e.g., via zxcvbn or
 * custom heuristics) and compare it against this threshold.
 *
 * Range: 0 (lowest) to 4 (highest)
 */
export type ComplexityScore = 0 | 1 | 2 | 3 | 4;

/** Declarative description of a password policy. */
export interface PolicyDeclaration {
  /**
   * The list of rule declarations that passwords must satisfy. See
   * `AnyRuleDeclaration` for supported rule types and their specific configs.
   */
  rules: AnyRuleDeclaration[];

  /**
   * Optional minimum complexity threshold that a password must meet or exceed.
   * If omitted, only the declared rules determine validity. Values: 0 | 1 | 2 |
   * 3 | 4
   */
  minComplexity?: ComplexityScore;
}
