import type { RuleDeclaration, RuleType } from "../declaration.js";

/** Configuration for the blocklist rule. */
export type BlocklistConfig = {
  /** Disallowed list of strings. */
  blocklist: string[];
  /** When true, any blocklisted entry appearing as a substring will be rejected. */
  substringMatch: boolean;
};

/** Declares a rule that rejects passwords containing disallowed strings. */
export type BlocklistRuleDeclaration = RuleDeclaration<
  typeof RuleType.blocklist,
  BlocklistConfig
>;
