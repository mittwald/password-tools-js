import type { RuleDeclaration, RuleType } from "../declaration.js";

export interface CharConfig {
    chars: string;
    min?: number;
    max?: number;
}

export type CharRuleDeclaration = RuleDeclaration<RuleType.char, CharConfig>;
