import { findSequences } from "./lib/findSequences.js";

export const findRepeatingChars = (pw: string, maxLength: number): string[] => {
    return findSequences(pw, maxLength, (char, lastChar) => char === lastChar);
};
