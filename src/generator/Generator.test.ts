import { Policy } from "../policy/Policy";
import { BlocklistRule } from "../rule/blocklist/BlocklistRule";
import { CharPoolRule } from "../rule/charpool/CharPoolRule";
import { CharRule } from "../rule/char/CharRule";
import { LengthRule } from "../rule/length/LengthRule";
import { RegexRule } from "../rule/regex/RegexRule";
import { PasswordGenerationError } from "../errors";
import { Generator } from "./Generator";
import { describe, expect, test } from "vitest";
import testPolicyMittwald from "./../../test/policy_success/mittwald.yaml?raw";

describe(Generator.name, { timeout: 20000 }, () => {
    const testGeneratePassphraseByPolicy = async (policy: Policy, test: (generated: string) => void): Promise<void> => {
        const generator = new Generator(policy);
        test(await generator.generatePassphrase());
    };
    const testGeneratePasswordByPolicy = async (policy: Policy, test: (generated: string) => void): Promise<void> => {
        const generator = new Generator(policy);
        test(await generator.generatePassword());
    };

    const generateTestsForGenerateStringFunction = (
        testAgainstPolicy: typeof testGeneratePassphraseByPolicy | typeof testGeneratePasswordByPolicy,
    ): void => {
        test("from mittwald.yaml (without hibp)", async () => {
            const policy = Policy.fromDeclaration(testPolicyMittwald);
            await testAgainstPolicy(policy, (passphrase) => expect(policy.validate(passphrase).isValid).toBeTruthy());
        });
        test("from policy: test minLength", async () => {
            const policy = new Policy([new LengthRule({ min: 10 }), new LengthRule({ min: 20 })]);
            await testAgainstPolicy(policy, (passphrase) => {
                expect(policy.validate(passphrase).isValid).toBeTruthy();
                expect(passphrase.length).toBeGreaterThanOrEqual(20);
            });
        });
        test("from policy: test maxLength", async () => {
            const policy = new Policy([new LengthRule({ max: 10 }), new LengthRule({ max: 5 })]);
            await testAgainstPolicy(policy, (passphrase) => {
                expect(policy.validate(passphrase).isValid).toBeTruthy();
                expect(passphrase.length).toBeLessThanOrEqual(5);
            });
        });
        test("from policy: have length of at least 10, no special, number, or nonAscii, no 'a', 'b', 'c' and do not start with and d", async () => {
            const policy = new Policy([
                new LengthRule({ min: 10 }),
                new CharPoolRule({ charPools: ["special", "numbers", "nonAscii"], max: 0 }),
                new CharRule({ chars: "abc", max: 0 }),
                new RegexRule({ pattern: "^d", max: 0 }),
            ]);

            await testAgainstPolicy(policy, (passphrase) => expect(passphrase));
        });
        test("throw an error when loop limit is reached", async () => {
            const policy = new Policy([
                new BlocklistRule({ substringMatch: true, blocklist: ["password"] }),
                new RegexRule({ pattern: "password" }),
            ]);

            await expect(testAgainstPolicy(policy, () => {})).rejects.toThrow(
                new PasswordGenerationError(policy, 5, expect.anything()),
            );
        });
    };
    describe("generatePassphrase", () => {
        generateTestsForGenerateStringFunction(testGeneratePassphraseByPolicy);
    });
    describe("generatePassword", () => {
        generateTestsForGenerateStringFunction(testGeneratePasswordByPolicy);
    });
    test(`expect ${Generator.generateAnyPassphrase.name} not to throw`, async () => {
        await expect(Generator.generateAnyPassphrase()).resolves.not.toThrow();
    });
    test(`expect ${Generator.generateAnyPassword.name} not to throw`, async () => {
        await expect(Generator.generateAnyPassword()).resolves.toHaveLength(16);
    });
});
