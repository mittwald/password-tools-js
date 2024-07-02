import type { RuleDeclaration, RuleType } from "../declaration.js";

export interface BlocklistConfig {
    blocklist: string[];
    substringMatch: boolean;
}

export type BlocklistRuleDeclaration = RuleDeclaration<RuleType.blocklist, BlocklistConfig>;
