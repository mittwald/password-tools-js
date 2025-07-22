import { execa as command } from "execa";
import { describe, expect, test } from "vitest";

describe(
    "validatePasswordsCmd",
    () => {
        test("output", async () => {
            const { exitCode, stderr } = await command("yarn", ["password-tools-js", "validate-passwords"], {
                reject: false,
            });

            expect(exitCode).toBe(1);
            return expect(stderr).toMatchInlineSnapshot(`
              "password-validation validate-passwords

              Validates passwords against the provided policy

              Options:
                -s, --silent  [boolean] [default: false]
                -v, --verbose  [boolean] [default: false]
                -p, --policyPath, --path  The path of your policy  [string] [required]
                -P, --passwords, --pw  [array] [required]

              Missing required arguments: policyPath, passwords"
            `);
        });
        test("noDir", async () => {
            const { exitCode, stderr } = await command(
                "yarn",
                ["password-tools-js", "validate-passwords", "-p", "notAPolicy", "-P", "my,.-P4ssw0rd†!"],
                { reject: false },
            );

            expect(exitCode).toBe(1);
            return expect(stderr).toMatchInlineSnapshot(`"[31m✖[39m Policy file notAPolicy does not exists!"`);
        });
        test("success", async () => {
            const { exitCode, stderr } = await command(
                "yarn",
                [
                    "password-tools-js",
                    "validate-passwords",
                    "-p",
                    "test/policy_success/testPolicy.yaml",
                    "-P",
                    "my,.-P4ssw0rd†!",
                ],
                { reject: false },
            );

            expect(exitCode).toBe(0);
            return expect(stderr).toMatchInlineSnapshot(`
              "- Verifying password...
              [32m✔[39m my,.-P4ssw0rd†!"
            `);
        });
        test("fails", async () => {
            const { exitCode, stderr } = await command(
                "yarn",
                [
                    "password-tools-js",
                    "validate-passwords",
                    "-p",
                    "test/policy_success/testPolicy.yaml",
                    "-P",
                    "my,.-P4ssw0rd†!",
                    "fails",
                ],
                { reject: false },
            );

            expect(exitCode).toBe(1);
            return expect(stderr).toMatchInlineSnapshot(`
              "- Verifying password...
              [32m✔[39m my,.-P4ssw0rd†!
              - Verifying password...
              [31m✖[39m fails"
            `);
        });
        test("verbose", async () => {
            const { exitCode, stderr } = await command(
                "yarn",
                [
                    "password-tools-js",
                    "validate-passwords",
                    "-p",
                    "test/policy_success/testPolicy.yaml",
                    "-P",
                    "my,.-P4ssw0rd†!",
                    "fails",
                    "-v",
                ],
                { reject: false },
            );

            expect(exitCode).toBe(1);
            return expect(stderr).toMatchInlineSnapshot(`
              "- Verifying password...
              [32m✔[39m my,.-P4ssw0rd†!
              - Verifying password...
              [31m✖[39m fails
                {
                "isValid": false,
                "ruleResults": [
                  {
                    "isValid": false,
                    "failingBoundary": "min",
                    "length": 5,
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
                    "isValid": false,
                    "failingBoundary": "min",
                    "ruleType": "charPool",
                    "charPools": [
                      {
                        "charPool": "special",
                        "occurrences": 0
                      },
                      {
                        "charPool": "numbers",
                        "occurrences": 0
                      }
                    ],
                    "totalOccurrences": 0,
                    "min": 3
                  },
                  {
                    "isValid": true,
                    "ruleType": "blocklist",
                    "substringMatch": true
                  }
                ],
                "complexity": {
                  "actual": 1,
                  "min": 0,
                  "warning": null
                }
              }"
            `);
        });
        test("silent", async () => {
            const { exitCode, stderr } = await command(
                "yarn",
                [
                    "password-tools-js",
                    "validate-passwords",
                    "-p",
                    "test/policy_success/testPolicy.yaml",
                    "-P",
                    "my,.-P4ssw0rd†!",
                    "-s",
                ],
                { reject: false },
            );

            expect(exitCode).toBe(0);
            return expect(stderr).toBe("");
        });
    },
    { timeout: 20000 },
);
