import { execa as command } from "execa";
import { describe, expect, test } from "vitest";

describe("CLI", { timeout: 20000 }, () => {
    test("basic cli", async () => {
        await expect(command("node", ["./bin/cli.js"])).rejects.toThrowErrorMatchingInlineSnapshot(`
              [ExecaError: Command failed with exit code 1: node ./bin/cli.js

              password-validation <cmd> [options]

              Commands:
                password-validation validate-policies        Validates all policies in the provided paths
                password-validation validate-passwords       Validates passwords against the provided policy
                password-validation generate-password        Generates a password from a policy
                password-validation generate-any-password    Generates any password
                password-validation generate-passphrase      Generates a passphrase from a policy
                password-validation generate-any-passphrase  Generates any passphrase

              Options:
                -s, --silent  [boolean] [default: false]
                -v, --verbose  [boolean] [default: false]

              Examples:
                validate-policies        -p <policyDirectory> [<policyDirectory>...]
                validate-passwords       -p <policy> -P <password> [<password>...]
                generate-password        -p <policy>
                generate-any-password
                generate-passphrase      -p <policy>
                generate-any-passphrase

              Choose one of the commands above ^]
            `);
    });
});
