import type { RuleDeclaration, RuleType } from "../declaration.js";

/** Configuration for the character occurrence rule. */
export type CharConfig = {
  /** Characters to count within the password. */
  chars: string;
  /** Minimum number of occurrences from `chars` required. */
  min?: number;
  /** Maximum number of occurrences from `chars` allowed. */
  max?: number;
};

/** Declares a rule limiting occurrences of specified characters. */
export type CharRuleDeclaration = RuleDeclaration<
  typeof RuleType.char,
  CharConfig
>;
