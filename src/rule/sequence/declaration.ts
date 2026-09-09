import type { RuleDeclaration, RuleType } from "../declaration.js";

/** Types of sequences the rule can detect and restrict. */
export enum SequenceType {
  /** Repeating characters like "aaaa". */
  repeat = "repeat",
  /** Keyboard-adjacent sequences like "qwerty". */
  keyboard = "keyboard",
  /** Numeric sequences like "1234". */
  number = "number",
  /** Alphabetical sequences like "abcd". */
  alphabet = "alphabet",
}

/** Configuration for the sequence rule. */
export type SequenceConfig = {
  /** Which sequence categories to check for. */
  sequences: SequenceType[];
  /** Maximum allowed contiguous sequence length. */
  maxLength?: number;
};

/** Declares a rule that limits predictable sequences within passwords. */
export type SequenceRuleDeclaration = RuleDeclaration<
  typeof RuleType.sequence,
  SequenceConfig
>;
