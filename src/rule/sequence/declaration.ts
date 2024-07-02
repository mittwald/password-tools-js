import type { RuleDeclaration, RuleType } from "../declaration.js";

export enum SequenceType {
    repeat = "repeat",
    keyboard = "keyboard",
    number = "number",
    alphabet = "alphabet",
}

export interface SequenceConfig {
    sequences: SequenceType[];
    maxLength?: number;
}

export type SequenceRuleDeclaration = RuleDeclaration<RuleType.sequence, SequenceConfig>;
