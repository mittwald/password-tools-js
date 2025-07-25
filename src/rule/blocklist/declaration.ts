import type { RuleDeclaration, RuleType } from "../declaration.js";

export type BlocklistConfig = {
    blocklist: string[];
    substringMatch: boolean;
};

export type BlocklistRuleDeclaration = RuleDeclaration<typeof RuleType.blocklist, BlocklistConfig>;
