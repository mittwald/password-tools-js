import type { RuleDeclaration, RuleType } from "../declaration.js";

/** Configuration for the Have I Been Pwned (HIBP) rule. */
export type HibpConfig = {
  /** Optional custom API URL for the HIBP range query endpoint. */
  endpointUrl?: string;
  /** If true, treat network or remote errors as a pass (non-blocking). */
  willSucceedOnError?: boolean;
};

/** Declares a rule that queries HIBP to detect compromised passwords. */
export type HibpRuleDeclaration = RuleDeclaration<
  typeof RuleType.hibp,
  HibpConfig
>;
