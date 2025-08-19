import type { RuleDeclaration, RuleType } from "../declaration.js";

export const RegexFlags = {
  global: "g",
  multiLine: "m",
  insensitive: "i",
  sticky: "y",
  unicode: "u",
  singleLine: "s",
  indices: "d",
} as const;

export type OneOfRegexFlags = (typeof RegexFlags)[keyof typeof RegexFlags];

export type RegexConfig = {
  pattern: string;
  flags?: OneOfRegexFlags[];
  translationKey?: string;
  min?: number;
  max?: number;
};

export type RegexRuleDeclaration = RuleDeclaration<
  typeof RuleType.regex,
  RegexConfig
>;
