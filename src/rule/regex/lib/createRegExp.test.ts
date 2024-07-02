import { createRegExp } from "./createRegExp.js";
import { RegexFlags } from "../declaration.js";
import { describe, expect, test } from "vitest";

describe(createRegExp.name, () => {
    test("use all seven possible flags", () => {
        expect(
            createRegExp("\\d", [
                RegexFlags.global,
                RegexFlags.insensitive,
                RegexFlags.singleLine,
                RegexFlags.unicode,
                RegexFlags.indices,
                RegexFlags.sticky,
                RegexFlags.multiLine,
            ]),
        ).toStrictEqual(RegExp("\\d", "gisudym"));
    });
    test("ignore duplicate flags", () => {
        expect(createRegExp("\\d", [RegexFlags.multiLine, RegexFlags.multiLine])).toStrictEqual(RegExp("\\d", "m"));
    });
    test("setGlobal", () => {
        expect(createRegExp("\\d", [RegexFlags.multiLine], true)).toStrictEqual(RegExp("\\d", "gm"));
    });
    test("setGlobal + global flag", () => {
        expect(createRegExp("\\d", [RegexFlags.global], true)).toStrictEqual(RegExp("\\d", "g"));
    });
});
