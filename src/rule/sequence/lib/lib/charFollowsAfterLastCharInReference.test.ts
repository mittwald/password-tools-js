import { charFollowsAfterLastCharInReference } from "./charFollowsAfterLastCharInReference.js";
import { describe, expect, test } from "vitest";

describe(charFollowsAfterLastCharInReference.name, () => {
    test("return false when char is not subsequent to last char", () => {
        expect(charFollowsAfterLastCharInReference("g", "e", "abcdefghijklmnopqrstuvwxyz")).toBeFalsy();
    });
    test("return true when char is subsequent to last char", () => {
        expect(charFollowsAfterLastCharInReference("f", "e", "abcdefghijklmnopqrstuvwxyz")).toBeTruthy();
    });
});
