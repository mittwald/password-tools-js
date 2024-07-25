import { execa as command } from "execa";
import { describe, expect, test } from "vitest";

describe(
    "CLI",
    () => {
        test("yarn password-tools-js", () => {
            return expect(command("yarn", ["password-tools-js"])).rejects.toThrowErrorMatchingInlineSnapshot(`
          [ExecaError: Command failed with exit code 1: yarn password-tools-js

          password-validation <cmd> [options]

          Commands:
            password-validation validate-policies        Validates all policies in the provided paths
            password-validation validate-passwords       Validates passwords against the provided policy
            password-validation generate-password        Generates a password from a policy
            password-validation generate-any-password    Generates any password
            password-validation generate-passphrase      Generates a passphrase from a policy
            password-validation generate-any-passphrase  Generates any passphrase

          Examples:
            validate-policies        -P my/policies/ foo/anotherPolicyDir/
            validate-passwords       -P policies/examplePolicy.yaml -p myPassword anotherPw (optional: --booleanOnly; or -b)
            generate-password        -P policies/examplePolicy.yaml
            generate-any-password
            generate-passphrase      -P policies/examplePolicy.yaml
            generate-any-passphrase

          Choose one of the commands above ^]
        `);
        });
        test("validate-passwords", async () => {
            const processResult =
                await command`yarn password-tools-js validate-passwords -P test/testPolicy.yaml -p my,.-P4ssw0rd†!`;
            return expect(processResult.stdout).toMatchInlineSnapshot(`
              "Password: my,.-P4ssw0rd†! -> Result: {
                "isValid": true,
                "ruleResults": [
                  {
                    "isValid": true,
                    "length": 15,
                    "ruleType": "length",
                    "min": 8,
                    "max": 64
                  },
                  {
                    "isValid": true,
                    "ruleType": "regex",
                    "matches": 0,
                    "pattern": "^\\\\.",
                    "translationKey": "beginsWithDot",
                    "max": 0
                  },
                  {
                    "isValid": true,
                    "ruleType": "charPool",
                    "charPools": [
                      {
                        "charPool": "special",
                        "occurrences": 4
                      },
                      {
                        "charPool": "numbers",
                        "occurrences": 2
                      }
                    ],
                    "totalOccurrences": 6,
                    "min": 3
                  },
                  {
                    "isValid": true,
                    "ruleType": "blocklist",
                    "substringMatch": true
                  }
                ],
                "complexity": {
                  "actual": 3,
                  "min": 0,
                  "warning": null
                }
              }"
            `);
        });
        test("validate-passwords --booleanOnly", async () => {
            const processResult =
                await command`yarn password-tools-js validate-passwords -P test/testPolicy.yaml -p foo my,.-P4ssw0rd†! -b`;
            return expect(processResult.stdout).toMatchInlineSnapshot(`
                    "Password: foo -> Result: false
                    Password: my,.-P4ssw0rd†! -> Result: true"
                `);
        });
        test("generate-password", async () => {
            const processResult = await command`yarn password-tools-js generate-password -P test/testPolicy.yaml -T 30`;
            return expect(processResult.stdout).toContain("Password: ");
        });
        test("generate-any-password", async () => {
            const processResult = await command`yarn password-tools-js generate-any-password`;
            return expect(processResult.stdout).toContain("Password: ");
        });
        test("generate-passphrase", async () => {
            const processResult = await command`yarn password-tools-js generate-passphrase -P test/testPolicy.yaml`;
            return expect(processResult.stdout).toContain("Passphrase: ");
        });
        test("generate-any-passphrase", async () => {
            const processResult = await command`yarn password-tools-js generate-any-passphrase`;
            return expect(processResult.stdout).toContain("Passphrase: ");
        });
        test("validate-policies", () => {
            const processResultColorless = command({
                env: { FORCE_COLOR: "0" },
            })`yarn password-tools-js validate-policies -P test`;

            return expect(processResultColorless).rejects.toThrowErrorMatchingInlineSnapshot(`
              [ExecaError: Command failed with exit code 1: yarn password-tools-js validate-policies -P test

              ℹ Validating password policies in: test ...
              - brokenPolicy.yaml
              ✖ brokenPolicy.yaml: Error: must have required property 'ruleType',must have required property 'ruleType',must have required property 'blocklist',must have required property 'ruleType',must have required property 'chars',must have required property 'charPools',must have required property 'pattern',must match a schema in anyOf
              - mittwald.yaml
              ✔ mittwald.yaml
              - subDir/anotherPolicy.yaml
              ✔ subDir/anotherPolicy.yaml
              - testPolicy.yaml
              ✔ testPolicy.yaml
              - testPolicyFull.yaml
              ✔ testPolicyFull.yaml]
            `);
        });
    },
    { timeout: 20000 },
);
