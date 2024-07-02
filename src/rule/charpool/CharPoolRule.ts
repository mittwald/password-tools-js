import type { RuleValidationResult } from "../Rule.js";
import { SyncRule } from "../Rule.js";
import type { CharPoolConfig } from "./declaration.js";
import { valueObeysMinAndMax } from "../lib/valueObeysMinAndMax.js";
import { RuleType } from "../declaration.js";

const charPoolStore = {
    lowercase: /[a-zäöüß]/g,
    uppercase: /[A-ZÄÖÜẞ]/g,
    numbers: /\d/g,
    special: /[ !"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/g,
    nonAscii: /[^ -~]/g,
};

export type CharPool = keyof typeof charPoolStore;

export interface CharPoolContext {
    ruleType: RuleType.charPool;
    identifier?: string;
    charPools: Array<{
        charPool: CharPool;
        occurrences: number;
    }>;
    totalOccurrences: number;
}

export type CharPoolResult = CharPoolContext & Omit<CharPoolConfig, "charPools">;

export class CharPoolRule extends SyncRule<CharPoolConfig, CharPoolContext> {
    public validate(pw: string): RuleValidationResult<CharPoolResult> {
        const { max, charPools, ...restConfig } = this.config;
        const min = this.config.min === undefined && max === undefined ? 1 : this.config.min;

        const charPoolsAndTheirOccurrences: Array<{ charPool: CharPool; occurrences: number }> = [];

        let totalOccurrences = 0;

        for (const charPool of charPools) {
            const regex = charPoolStore[charPool];
            const occurrences = pw.match(regex)?.length ?? 0;

            charPoolsAndTheirOccurrences.push({
                charPool,
                occurrences,
            });

            totalOccurrences += occurrences;
        }

        const isValid = valueObeysMinAndMax(totalOccurrences, { min, max });

        const configWithoutCharPools: Omit<CharPoolConfig, "charPools"> = (({ charPools: ignored, ...rest }) => rest)(
            this.config,
        );

        return {
            isValid: isValid === true,
            failingBoundary: isValid === true ? undefined : isValid,
            ruleType: RuleType.charPool,
            charPools: charPoolsAndTheirOccurrences,
            totalOccurrences,
            ...configWithoutCharPools,
            min,
            ...restConfig,
        };
    }
}
