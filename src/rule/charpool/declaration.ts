import type { RuleDeclaration, RuleType } from "../declaration.js";
import type { CharPool } from "./CharPoolRule.js";

export type CharPoolConfig = {
    charPools: CharPool[];
    min?: number;
    max?: number;
};

export type CharPoolRuleDeclaration = RuleDeclaration<typeof RuleType.charPool, CharPoolConfig>;
