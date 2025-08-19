import { findSequences } from "./findSequences.js";
import { charFollowsAfterLastCharInReference } from "./charFollowsAfterLastCharInReference.js";

export const findAlphabetSequences = (
  pw: string,
  maxLength: number,
): string[] => {
  return findSequences(
    pw,
    maxLength,
    (char: string, lastChar: string): boolean => {
      return charFollowsAfterLastCharInReference(
        char,
        lastChar,
        "abcdefghijklmnopqrstuvwxyz",
      );
    },
  );
};
