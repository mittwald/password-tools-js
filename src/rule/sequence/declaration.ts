import type { RuleDeclaration, RuleType } from "../declaration.js";

export enum SequenceType {
  repeat = "repeat",
  keyboard = "keyboard",
  number = "number",
  alphabet = "alphabet",
}

export type SequenceConfig = {
  sequences: SequenceType[];
  maxLength?: number;
};

export type SequenceRuleDeclaration = RuleDeclaration<
  typeof RuleType.sequence,
  SequenceConfig
>;
