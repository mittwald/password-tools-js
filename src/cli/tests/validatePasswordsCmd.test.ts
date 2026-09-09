import { execa as command } from "execa";
import { describe, expect, test } from "vitest";
import stripAnsi from "strip-ansi";

describe("validatePasswordsCmd", { timeout: 20000 }, () => {
  test("output", async () => {
    const { exitCode, stderr } = await command(
      "node",
      ["./bin/cli.js", "validate-passwords"],
      {
        reject: false,
      },
    );

    expect(exitCode).toBe(1);
    return expect(stderr).toMatchInlineSnapshot(`
      "password-tools-js validate-passwords

      Validates passwords against the provided policy

      Options:
        -s, --silent  [boolean] [default: false]
        -v, --verbose  [boolean] [default: false]
            --version             Show version number  [boolean]
            --help                Show help  [boolean]
        -p, --policyPath, --path  The path of your policy  [string] [required]
        -P, --passwords, --pw  [array] [required]

      Missing required arguments: policyPath, passwords"
    `);
  });
  test("noDir", async () => {
    const { exitCode, stderr } = await command(
      "node",
      [
        "./bin/cli.js",
        "validate-passwords",
        "-p",
        "notAPolicy",
        "-P",
        "my,.-P4ssw0rd†!",
      ],
      { reject: false },
    );

    expect(exitCode).toBe(1);
    return expect(stripAnsi(stderr)).toMatchInlineSnapshot(
      `"✖ Policy file notAPolicy does not exists!"`,
    );
  });
  test("success", async () => {
    const { exitCode, stderr } = await command(
      "node",
      [
        "./bin/cli.js",
        "validate-passwords",
        "-p",
        "test/policy_success/testPolicy.yaml",
        "-P",
        "my,.-P4ssw0rd†!",
      ],
      { reject: false },
    );

    expect(exitCode).toBe(0);
    return expect(stripAnsi(stderr)).toMatchInlineSnapshot(`
              "- Verifying password...
              ✔ my,.-P4ssw0rd†!"
            `);
  });
  test("fails", async () => {
    const { exitCode, stderr } = await command(
      "node",
      [
        "./bin/cli.js",
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
    return expect(stripAnsi(stderr)).toMatchInlineSnapshot(`
              "- Verifying password...
              ✔ my,.-P4ssw0rd†!
              - Verifying password...
              ✖ fails"
            `);
  });
  test("verbose", async () => {
    const { exitCode, stderr } = await command(
      "node",
      [
        "./bin/cli.js",
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
    return expect(stripAnsi(stderr)).toMatchInlineSnapshot(`
          "- Verifying password...
          ✔ my,.-P4ssw0rd†!
          - Verifying password...
          ✖ fails
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
              "actual": 0,
              "min": 0,
              "warning": "wordByItself"
            }
          }"
        `);
  });
  test("silent", async () => {
    const { exitCode, stderr } = await command(
      "node",
      [
        "./bin/cli.js",
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
  // A policy that parses as YAML but does not describe a policy used to escape
  // as an unhandled exception and print a stack trace into the bundle.
  test("invalid-policy", async () => {
    const { exitCode, stderr } = await command(
      "node",
      [
        "./bin/cli.js",
        "validate-passwords",
        "-p",
        "test/policy_fails/brokenPolicy.yaml",
        "-P",
        "test",
      ],
      {
        reject: false,
      },
    );

    expect(exitCode).toBe(1);
    expect(stripAnsi(stderr)).toContain(
      "Policy file test/policy_fails/brokenPolicy.yaml is not valid:",
    );
    // The old behaviour printed frames pointing into the bundle.
    expect(stripAnsi(stderr)).not.toContain("file://");
  });
});
