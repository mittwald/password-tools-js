import { findSequences } from "./lib/findSequences.js";
import { charFollowsAfterLastCharInReference } from "./lib/charFollowsAfterLastCharInReference.js";

export const findKeyboardSequences = (pw: string, maxLength: number): string[] => {
    return findSequences(pw, maxLength, (char: string, lastChar: string): boolean => {
        const qwertzKeyboardRows = [
            "^1234567890ß´",
            "qwertzuiopü+",
            "QWERTZUIOPÜ*",
            "asdfghjklöä#",
            "ASDFGHJKLÖÄ'",
            "<yxcvbnm,.-",
            ">YXCVBNM;:_",
            '°!"§$%&/()=?`',
        ];

        const rowThatIncludesChar = qwertzKeyboardRows.find((row) => row.includes(char));

        return rowThatIncludesChar ? charFollowsAfterLastCharInReference(char, lastChar, rowThatIncludesChar) : false;
    });
};
