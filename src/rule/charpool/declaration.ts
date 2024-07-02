import type { RuleDeclaration, RuleType } from "../declaration.js";
import type { CharPool } from "./CharPoolRule.js";

export interface CharPoolConfig {
    charPools: CharPool[];
    min?: number;
    max?: number;
}

export type CharPoolRuleDeclaration = RuleDeclaration<RuleType.charPool, CharPoolConfig>;
