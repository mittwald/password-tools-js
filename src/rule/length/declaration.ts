import type { RuleDeclaration, RuleType } from "../declaration.js";

/** Configuration for the length rule. */
export type LengthConfig = {
  /** Minimum allowed password length (inclusive). */
  min?: number;
  /** Maximum allowed password length (inclusive). */
  max?: number;
};

/** Declares a length rule that validates a password's character count. */
export type LengthRuleDeclaration = RuleDeclaration<
  typeof RuleType.length,
  LengthConfig
>;
