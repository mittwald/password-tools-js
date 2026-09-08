import { execa as command } from "execa";
import { describe, expect, test } from "vitest";
import stripAnsi from "strip-ansi";

describe("generatePasswordsCmd", { timeout: 20000 }, () => {
  test("output", async () => {
    const { exitCode, stderr } = await command(
      "node",
      ["./bin/cli.js", "generate-password"],
      {
        reject: false,
      },
    );

    expect(exitCode).toBe(1);
    return expect(stderr).toMatchInlineSnapshot(`
      "password-tools-js generate-password

      Generates a password from a policy

      Options:
        -s, --silent  [boolean] [default: false]
        -v, --verbose  [boolean] [default: false]
            --version             Show version number  [boolean]
            --help                Show help  [boolean]
        -t, --timeout             Timeout in seconds for password generator  [number] [default: 25]
        -p, --policyPath, --path  The path of your policy  [string] [required]

      Missing required argument: policyPath"
    `);
  });
  test("no-policy", async () => {
    const { exitCode, stderr } = await command(
      "node",
      ["./bin/cli.js", "generate-password", "-p", "notAPolicy"],
      {
        reject: false,
      },
    );

    expect(exitCode).toBe(1);
    return expect(stripAnsi(stderr)).toMatchInlineSnapshot(
      `"✖ Policy file notAPolicy does not exists!"`,
    );
  });
  test("fails", async () => {
    const { exitCode, stderr } = await command(
      "node",
      [
        "./bin/cli.js",
        "generate-password",
        "-p",
        "test/policy_fails/contractItSelfPolicy.yaml",
        // Explicit, so the test exercises the error path rather than waiting
        // out whatever the default happens to be.
        "-t",
        "2",
      ],
      { reject: false },
    );

    expect(exitCode).toBe(1);
    return expect(stripAnsi(stderr)).toMatchInlineSnapshot(`
              "- Generating password...
              ✖ Exceeded timeout while trying to generate a password. Does the policy contradict itself?"
            `);
  });
  test("silent", async () => {
    const { exitCode, stderr } = await command(
      "node",
      [
        "./bin/cli.js",
        "generate-password",
        "-p",
        "test/policy_success/testPolicy.yaml",
        "-s",
      ],
      { reject: false },
    );

    expect(exitCode).toBe(0);
    return expect(stderr).toBe("");
  });
});
