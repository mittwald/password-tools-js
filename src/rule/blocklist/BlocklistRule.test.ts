import { BlocklistRule } from "./BlocklistRule.js";
import { RuleType } from "../declaration.js";
import { testRule } from "../lib/testRule";
import { describe } from "vitest";

describe(`${BlocklistRule.name}.validatePassword()`, () => {
    describe("substringMatch: false", () => {
        testRule(new BlocklistRule({ blocklist: ["123", "passwort"], substringMatch: false }), [
            {
                pw: "123",
                result: {
                    ruleType: RuleType.blocklist,
                    blockedSubstrings: undefined,
                    isValid: false,
                    substringMatch: false,
                },
            },
            {
                pw: "01234",
                result: {
                    ruleType: RuleType.blocklist,
                    blockedSubstrings: undefined,
                    isValid: true,
                    substringMatch: false,
                },
            },
        ]);
    });
    describe("substringMatch: true", () => {
        testRule(new BlocklistRule({ blocklist: ["123", "passwort"], substringMatch: true }), [
            {
                pw: "foo",
                result: {
                    ruleType: RuleType.blocklist,
                    blockedSubstrings: undefined,
                    isValid: true,
                    substringMatch: true,
                },
            },
            {
                pw: "123",
                result: {
                    ruleType: RuleType.blocklist,
                    blockedSubstrings: ["123"],
                    isValid: false,
                    substringMatch: true,
                },
            },
            {
                pw: "01234",
                result: {
                    ruleType: RuleType.blocklist,
                    blockedSubstrings: ["123"],
                    isValid: false,
                    substringMatch: true,
                },
            },
        ]);
    });
    describe("test case-insensitivity", () => {
        testRule(new BlocklistRule({ blocklist: ["passwort"], substringMatch: false }), [
            {
                pw: "PASSWORT",
                result: {
                    ruleType: RuleType.blocklist,
                    blockedSubstrings: undefined,
                    isValid: false,
                    substringMatch: false,
                },
            },
        ]);
        testRule(new BlocklistRule({ blocklist: ["PASSWORT"], substringMatch: false }), [
            {
                pw: "passwort",
                result: {
                    ruleType: RuleType.blocklist,
                    blockedSubstrings: undefined,
                    isValid: false,
                    substringMatch: false,
                },
            },
        ]);
    });
});
