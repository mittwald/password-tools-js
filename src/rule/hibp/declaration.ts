import type { RuleDeclaration, RuleType } from "../declaration.js";

export type HibpConfig = {
  // @default https://api.pwnedpasswords.com
  endpointUrl?: string;
};

export type HibpRuleDeclaration = RuleDeclaration<
  typeof RuleType.hibp,
  HibpConfig
>;
