import type { RuleValidationResult } from "../Rule.js";
import { SyncRule } from "../Rule.js";
import type { BlocklistConfig } from "./declaration.js";
import { RuleType } from "../declaration.js";

type BlocklistResultContext = {
    ruleType: typeof RuleType.blocklist;
    blockedSubstrings?: string[];
};

export type BlocklistResult = BlocklistResultContext & Omit<BlocklistConfig, "blocklist">;

export class BlocklistRule extends SyncRule<typeof RuleType.blocklist, BlocklistConfig, BlocklistResultContext> {
    ruleType = RuleType.blocklist;

    public validate(pw: string): RuleValidationResult<BlocklistResult> {
        const { blocklist, substringMatch, ...restConfig } = this.config;

        const lowercaseList = blocklist.map((e) => e.toLowerCase());
        const lowercasePw = pw.toLowerCase();

        const isBlocklisted = substringMatch
            ? lowercaseList.some((e) => lowercasePw.includes(e))
            : lowercaseList.includes(lowercasePw);

        const blockedSubstrings =
            substringMatch && isBlocklisted ? lowercaseList.filter((e) => lowercasePw.includes(e)) : undefined;

        const configWithoutBlocklist = (({ blocklist: ignoredBlocklist, ...rest }) => rest)(this.config);

        return {
            isValid: !isBlocklisted,
            blockedSubstrings,
            ruleType: this.ruleType,
            ...configWithoutBlocklist,
            ...restConfig,
        };
    }
}
