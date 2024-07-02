import type { RuleValidationResult } from "../Rule.js";
import { SyncRule } from "../Rule.js";
import type { CharConfig } from "./declaration.js";
import { valueObeysMinAndMax } from "../lib/valueObeysMinAndMax.js";
import { RuleType } from "../declaration.js";

export interface CharsContext {
    ruleType: RuleType.char;
    chars: Array<{
        char: string;
        occurrences: number;
    }>;
    totalOccurrences: number;
}

export type CharResult = CharsContext & Omit<CharConfig, "chars">;

export class CharRule extends SyncRule<CharConfig, CharsContext> {
    public validate(pw: string): RuleValidationResult<CharResult> {
        const { max, chars, ...restConfig } = this.config;
        const min = this.config.min === undefined && max === undefined ? 1 : this.config.min;

        const charArray = chars.split("");
        const charsAndTheirOccurrences: Array<{ char: string; occurrences: number }> = [];
        let totalOccurrences = 0;

        for (const char of charArray) {
            const occurrences = pw.split(char).length - 1;

            charsAndTheirOccurrences.push({ char, occurrences });

            totalOccurrences += occurrences;
        }

        const isValid = valueObeysMinAndMax(totalOccurrences, { min, max });

        const configWithoutChars: Omit<CharConfig, "chars"> = (({ chars: ignored, ...rest }) => rest)(this.config);

        return {
            isValid: isValid === true,
            failingBoundary: isValid === true ? undefined : isValid,
            chars: charsAndTheirOccurrences,
            totalOccurrences,
            ruleType: RuleType.char,
            ...configWithoutChars,
            min,
            ...restConfig,
        };
    }
}
