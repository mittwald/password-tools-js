import { execa as command } from "execa";
import { describe, expect, test } from "vitest";

describe(
    "generatePassphraseCmd",
    () => {
        test("output", async () => {
            const { exitCode, stderr } = await command("yarn", ["password-tools-js", "generate-passphrase"], {
                reject: false,
            });

            expect(exitCode).toBe(1);
            return expect(stderr).toMatchInlineSnapshot(`
              "password-validation generate-passphrase

              Generates a passphrase from a policy

              Options:
                -s, --silent  [boolean] [default: false]
                -v, --verbose  [boolean] [default: false]
                -t, --timeout             Timeout in seconds for password generator  [number] [default: 5]
                -p, --policyPath, --path  The path of your policy  [string] [required]

              Missing required argument: policyPath"
            `);
        });
        test("no-policy", async () => {
            const { exitCode, stderr } = await command(
                "yarn",
                ["password-tools-js", "generate-passphrase", "-p", "notAPolicy"],
                {
                    reject: false,
                },
            );

            expect(exitCode).toBe(1);
            return expect(stderr).toMatchInlineSnapshot(`"[31m✖[39m Policy file notAPolicy does not exists!"`);
        });
        test("fails", async () => {
            const { exitCode, stderr } = await command(
                "yarn",
                ["password-tools-js", "generate-passphrase", "-p", "test/policy_fails/contractItSelfPolicy.yaml"],
                { reject: false },
            );

            expect(exitCode).toBe(1);
            return expect(stderr).toMatchInlineSnapshot(`
              "- Generating passphrase...
              [31m✖[39m Exceeded timeout while trying to generate a password. Does the policy contradict itself?"
            `);
        });
        test("silent", async () => {
            const { exitCode, stderr } = await command(
                "yarn",
                ["password-tools-js", "generate-passphrase", "-p", "test/policy_success/testPolicy.yaml", "-s"],
                { reject: false },
            );

            expect(exitCode).toBe(0);
            return expect(stderr).toBe("");
        });
    },
    { timeout: 20000 },
);
