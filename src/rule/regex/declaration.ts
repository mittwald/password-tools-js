import type { RuleDeclaration, RuleType } from "../declaration.js";

/** Supported RegExp flags. Use a subset to parameterize rule behavior. */
export const RegexFlags = {
  global: "g",
  multiLine: "m",
  insensitive: "i",
  sticky: "y",
  unicode: "u",
  singleLine: "s",
  indices: "d",
} as const;

/** Union of supported RegExp flag string literals. */
export type OneOfRegexFlags = (typeof RegexFlags)[keyof typeof RegexFlags];

/** Configuration for the regex rule. */
export type RegexConfig = {
  /** Pattern string used to construct a RegExp. */
  pattern: string;
  /** Optional list of flags to apply to the RegExp. */
  flags?: OneOfRegexFlags[];
  /** Optional i18n key to describe this rule in UI. */
  translationKey?: string;
  /** Minimum number of matches required for the password to be valid. */
  min?: number;
  /** Maximum number of matches allowed for the password to be valid. */
  max?: number;
};

/** Declares a regex-based rule that counts matches of a given pattern. */
export type RegexRuleDeclaration = RuleDeclaration<
  typeof RuleType.regex,
  RegexConfig
>;
