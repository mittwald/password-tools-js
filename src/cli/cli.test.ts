import { execa as command } from "execa";
import { describe, expect, test } from "vitest";

describe("CLI", { timeout: 20000 }, () => {
  test("basic cli", async () => {
    await expect(command("node", ["./bin/cli.js"])).rejects
      .toThrowErrorMatchingInlineSnapshot(`
      [ExecaError: Command failed with exit code 1: node ./bin/cli.js

      password-tools-js <cmd> [options]

      Commands:
        password-tools-js validate-policies        Validates all policies in the provided paths
        password-tools-js validate-passwords       Validates passwords against the provided policy
        password-tools-js generate-password        Generates a password from a policy
        password-tools-js generate-any-password    Generates any password
        password-tools-js generate-passphrase      Generates a passphrase from a policy
        password-tools-js generate-any-passphrase  Generates any passphrase

      Options:
        -s, --silent  [boolean] [default: false]
        -v, --verbose  [boolean] [default: false]
            --version  Show version number  [boolean]
            --help     Show help  [boolean]

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
