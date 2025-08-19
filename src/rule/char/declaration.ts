import type { RuleDeclaration, RuleType } from "../declaration.js";

export type CharConfig = {
  chars: string;
  min?: number;
  max?: number;
};

export type CharRuleDeclaration = RuleDeclaration<
  typeof RuleType.char,
  CharConfig
>;
