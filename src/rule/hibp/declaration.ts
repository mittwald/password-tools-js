import type { RuleDeclaration, RuleType } from "../declaration.js";

export type HibpConfig = {
  endpointUrl?: string;
  willSucceedOnError?: boolean;
};

export type HibpRuleDeclaration = RuleDeclaration<
  typeof RuleType.hibp,
  HibpConfig
>;
