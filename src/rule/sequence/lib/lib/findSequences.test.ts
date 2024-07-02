import { findSequences } from "./findSequences.js";
import { describe, expect, test } from "vitest";

describe(findSequences.name, () => {
    const validPw = "aaabbb";
    const invalidSequences = ["aaaa", "bbbb"];
    const invalidPw = `x_${invalidSequences}_x`;
    const maxLength = 3;

    test(`return [], because no sequence > maxLength of ${maxLength} in pw: '${validPw}'`, () => {
        expect(findSequences(validPw, maxLength, (char, lastChar) => char === lastChar)).toStrictEqual([]);
    });
    test(`return ${invalidSequences.toString()}, because they exceed the maxLength of ${maxLength} in pw: '${invalidPw}'`, () => {
        expect(findSequences(invalidPw, maxLength, (char, lastChar) => char === lastChar)).toStrictEqual(
            invalidSequences,
        );
    });
});
