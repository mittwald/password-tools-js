import type { RuleValidationResult } from "../Rule.js";
import { AsyncRule } from "../Rule.js";
import { HaveIBeenPwnedClient } from "./client/HaveIBeenPwnedClient.js";
import type { HibpConfig } from "./declaration.js";
import { RuleType } from "../declaration.js";

interface ResultContext {
    ruleType: RuleType.hibp;
}

export type HibpResult = ResultContext & HibpConfig;

export class HibpRule extends AsyncRule<HibpConfig, ResultContext> {
    public async validate(pw: string): Promise<RuleValidationResult<HibpResult>> {
        const client = new HaveIBeenPwnedClient();
        const isLeaked = await client.isPasswordLeaked(pw);

        return {
            isValid: !isLeaked,
            ruleType: RuleType.hibp,
            ...this.config,
        };
    }
}
