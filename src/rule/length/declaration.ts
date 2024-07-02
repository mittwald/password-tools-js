import type { RuleDeclaration, RuleType } from "../declaration.js";

export interface LengthConfig {
    min?: number;
    max?: number;
}

export type LengthRuleDeclaration = RuleDeclaration<RuleType.length, LengthConfig>;
