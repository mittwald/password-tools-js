import { findNumberSequences } from "./findNumberSequences.js";
import { findAlphabetSequences } from "./findAlphabetSequence.js";
import { findKeyboardSequences } from "./findKeyboardSequences.js";
import { findRepeatingChars } from "./findRepeatingChars.js";
import { describe, expect, test } from "vitest";

interface TestFunctionsThatFindSequencesProps {
    theSequenceFindingFunctionWeWantToTest: (pw: string, maxLength: number) => string[];
    maxLength?: number;
    invalidSequences: string[];
}

const testFunctionsThatFindSequences = (props: TestFunctionsThatFindSequencesProps): void => {
    const { theSequenceFindingFunctionWeWantToTest, invalidSequences } = props;
    const maxLength = props.maxLength ?? 3;

    describe(theSequenceFindingFunctionWeWantToTest.name, () => {
        const validPw = "paßword";
        const invalidPw = `x_${invalidSequences}_x`;

        test(`return [], because no sequence > maxLength of ${maxLength} in pw: '${validPw}'`, () => {
            expect(theSequenceFindingFunctionWeWantToTest(validPw, maxLength)).toStrictEqual([]);
        });
        test(`return ${invalidSequences}, because they exceed the maxLength of ${maxLength} in pw: '${invalidPw}'`, () => {
            expect(theSequenceFindingFunctionWeWantToTest(invalidPw, maxLength)).toStrictEqual(invalidSequences);
        });
    });
};

describe("findSpecificSequences", () => {
    testFunctionsThatFindSequences({
        theSequenceFindingFunctionWeWantToTest: findRepeatingChars,
        invalidSequences: ["11111", "3333"],
    });
    testFunctionsThatFindSequences({
        theSequenceFindingFunctionWeWantToTest: findKeyboardSequences,
        invalidSequences: ["asdf", "1234"],
    });
    testFunctionsThatFindSequences({
        theSequenceFindingFunctionWeWantToTest: findNumberSequences,
        invalidSequences: ["123456789"],
    });
    testFunctionsThatFindSequences({
        theSequenceFindingFunctionWeWantToTest: findAlphabetSequences,
        invalidSequences: ["abcd", "rstu"],
    });
});
