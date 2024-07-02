import type { RuleDeclaration, RuleType } from "../declaration.js";

export interface HibpConfig {}

export type HibpRuleDeclaration = RuleDeclaration<RuleType.hibp, HibpConfig>;
