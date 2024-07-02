import { findSequences } from "./lib/findSequences.js";
import { charFollowsAfterLastCharInReference } from "./lib/charFollowsAfterLastCharInReference.js";

export const findNumberSequences = (pw: string, maxLength: number): string[] => {
    return findSequences(pw, maxLength, (char: string, lastChar: string): boolean => {
        return charFollowsAfterLastCharInReference(char, lastChar, "0123456789");
    });
};
