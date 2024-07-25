import { Policy } from "../policy/Policy";
import { BlocklistRule } from "../rule/blocklist/BlocklistRule";
import { CharPoolRule } from "../rule/charpool/CharPoolRule";
import { CharRule } from "../rule/char/CharRule";
import { LengthRule } from "../rule/length/LengthRule";
import { RegexRule } from "../rule/regex/RegexRule";
import { PasswordGenerationError } from "../errors";
import { Generator } from "./Generator";
import { LocalPolicyYamlLoader } from "../policy/loader/LocalPolicyYamlLoader";
import { describe, expect, test } from "vitest";

describe(
    Generator.name,
    () => {
        const testGeneratePassphraseByPolicy = async (
            policy: Policy,
            test: (generated: string) => void,
        ): Promise<void> => {
            const generator = new Generator(policy);
            test(await generator.generatePassphrase());
        };
        const testGeneratePasswordByPolicy = async (
            policy: Policy,
            test: (generated: string) => void,
        ): Promise<void> => {
            const generator = new Generator(policy);
            test(await generator.generatePassword());
        };

        const generateTestsForGenerateStringFunction = (
            testAgainstPolicy: typeof testGeneratePassphraseByPolicy,
        ): void => {
            test("from mittwald.yaml (without hibp)", async () => {
                const policy = Policy.fromDeclaration(new LocalPolicyYamlLoader("test").loadPolicy("mittwald"));
                await testAgainstPolicy(policy, (passphrase) =>
                    expect(policy.validate(passphrase).isValid).toBeTruthy(),
                );
            });
            test("from policy: lengthRule with min 10", async () => {
                const policy = new Policy([new LengthRule({ min: 10 })]);
                await testAgainstPolicy(policy, (passphrase) =>
                    expect(policy.validate(passphrase).isValid).toBeTruthy(),
                );
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
                await expect(new Generator(policy).generatePassphrase()).rejects.toThrowError(
                    new PasswordGenerationError(policy, 10),
                );
            });
        };
        describe("generatePassphrase", () => {
            generateTestsForGenerateStringFunction(testGeneratePassphraseByPolicy);
        });
        describe("generatePassword", () => {
            generateTestsForGenerateStringFunction(testGeneratePasswordByPolicy);
        });
        test(`expect ${Generator.generateAnyPassphrase.name} not to throw`, () => {
            expect(Generator.generateAnyPassphrase());
        });
        test(`expect ${Generator.generateAnyPassword.name} not to throw`, () => {
            expect(Generator.generateAnyPassword().length).toBeGreaterThanOrEqual(12);
        });
    },
    {
        timeout: 20000,
    },
);
