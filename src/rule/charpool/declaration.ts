import type { RuleDeclaration, RuleType } from "../declaration.js";
import type { CharPool } from "./CharPoolRule.js";

/** Configuration for the character pool rule. */
export type CharPoolConfig = {
  /** The character pools to consider (e.g., lowercase, uppercase, numbers). */
  charPools: CharPool[];
  /** Minimum total number of characters across the selected pools. */
  min?: number;
  /** Maximum total number of characters across the selected pools. */
  max?: number;
};

/**
 * Declares a rule restricting the total occurrences of characters from
 * specified pools.
 */
export type CharPoolRuleDeclaration = RuleDeclaration<
  typeof RuleType.charPool,
  CharPoolConfig
>;
