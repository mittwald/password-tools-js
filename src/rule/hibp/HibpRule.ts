import type { RuleValidationResult } from "../Rule.js";
import { AsyncRule } from "../Rule.js";
import { HaveIBeenPwnedClient } from "./client/HaveIBeenPwnedClient.js";
import type { HibpConfig } from "./declaration.js";
import { RuleType } from "../declaration.js";

export type ResultContext = {
    ruleType: typeof RuleType.hibp;
};

export type HibpResult = ResultContext & HibpConfig;

export class HibpRule extends AsyncRule<typeof RuleType.hibp, HibpConfig, ResultContext> {
    ruleType = RuleType.hibp;

    public async validate(pw: string): Promise<RuleValidationResult<HibpResult>> {
        const client = new HaveIBeenPwnedClient();
        const isLeaked = await client.isPasswordLeaked(pw);

        return {
            isValid: !isLeaked,
            ruleType: this.ruleType,
            ...this.config,
        };
    }
}
