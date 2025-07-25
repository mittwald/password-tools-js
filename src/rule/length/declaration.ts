import type { RuleDeclaration, RuleType } from "../declaration.js";

export type LengthConfig = {
    min?: number;
    max?: number;
};

export type LengthRuleDeclaration = RuleDeclaration<typeof RuleType.length, LengthConfig>;
