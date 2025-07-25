import type { RuleDeclaration, RuleType } from "../declaration.js";

export type HibpConfig = Record<string, string | boolean>;

export type HibpRuleDeclaration = RuleDeclaration<typeof RuleType.hibp, HibpConfig>;
