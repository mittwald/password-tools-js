import type { RuleValidationResult } from "../Rule.js";
import { SyncRule } from "../Rule.js";
import type { SequenceConfig } from "./declaration.js";
import { SequenceType } from "./declaration.js";
import { RuleType } from "../declaration.js";
import { findNumberSequences } from "./lib/findNumberSequences.js";
import { findAlphabetSequences } from "./lib/findAlphabetSequence.js";
import { findKeyboardSequences } from "./lib/findKeyboardSequences.js";
import { findRepeatingChars } from "./lib/findRepeatingChars.js";

interface FoundSequenceObject {
    type: SequenceType;
    found: string[];
}

interface ResultContext {
    ruleType: RuleType.sequence;
    sequences: FoundSequenceObject[];
}

export type SequenceResult = Omit<SequenceConfig, "sequences"> & ResultContext;

export class SequenceRule extends SyncRule<SequenceConfig, ResultContext> {
    public validate(pw: string): RuleValidationResult<SequenceResult> {
        const { sequences } = this.config;
        const maxLength = this.config.maxLength ?? 3;

        const foundSequenceObjects = sequences.map((sequenceType) => {
            return {
                type: sequenceType,
                found: this.findSequences(sequenceType, pw, maxLength),
            };
        });

        const isValid = !foundSequenceObjects.some((e: FoundSequenceObject) => e.found.length > 0);

        const configWithoutSequences: Omit<SequenceConfig, "sequences"> = (({ sequences: ignored, ...rest }) => rest)(
            this.config,
        );

        return {
            ruleType: RuleType.sequence,
            sequences: foundSequenceObjects,
            isValid,
            ...configWithoutSequences,
            maxLength,
        };
    }

    private findSequences(sequenceType: SequenceType, pw: string, maxLength: number): string[] {
        switch (sequenceType) {
            case SequenceType.repeat:
                return findRepeatingChars(pw, maxLength);
            case SequenceType.keyboard:
                return findKeyboardSequences(pw, maxLength);
            case SequenceType.number:
                return findNumberSequences(pw, maxLength);
            case SequenceType.alphabet:
                return findAlphabetSequences(pw, maxLength);
        }
    }
}
