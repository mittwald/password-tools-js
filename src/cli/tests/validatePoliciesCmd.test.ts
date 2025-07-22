import { execa as command } from "execa";
import { describe, expect, test } from "vitest";
import stripAnsi from "strip-ansi";

describe("validatePoliciesCmd", { timeout: 20000 }, () => {
    test("output", async () => {
        const { exitCode, stderr } = await command("node", ["./bin/cli.js", "validate-policies"], {
            reject: false,
        });

        expect(exitCode).toBe(1);
        return expect(stderr).toMatchInlineSnapshot(`
              "password-validation validate-policies

              Validates all policies in the provided paths

              Options:
                -s, --silent  [boolean] [default: false]
                -v, --verbose  [boolean] [default: false]
                -p, --policyPaths, --paths  The paths to your policy-directories  [array] [required]

              Missing required argument: policyPaths"
            `);
    });
    test("noDir", async () => {
        const { exitCode, stderr } = await command("node", ["./bin/cli.js", "validate-policies", "-p", "notAdir"], {
            reject: false,
        });

        expect(exitCode).toBe(1);
        return expect(stripAnsi(stderr)).toMatchInlineSnapshot(`"✖ Policy directory notAdir does not exists!"`);
    });
    test("success", async () => {
        const { exitCode, stderr } = await command(
            "node",
            ["./bin/cli.js", "validate-policies", "-p", "test/policy_success"],
            { reject: false },
        );

        expect(exitCode).toBe(0);
        return expect(stripAnsi(stderr)).toMatchInlineSnapshot(`
          "ℹ Validating password policies in: test/policy_success ...
          - mittwald.yaml
          ✔ mittwald.yaml
          - subDir/anotherPolicy.yaml
          ✔ subDir/anotherPolicy.yaml
          - testPolicy.yaml
          ✔ testPolicy.yaml
          - testPolicyFull.yaml
          ✔ testPolicyFull.yaml"
        `);
    });
    test("fails", async () => {
        const { exitCode, stderr } = await command(
            "node",
            ["./bin/cli.js", "validate-policies", "-p", "test/policy_fails"],
            { reject: false },
        );

        expect(exitCode).toBe(1);
        return expect(stripAnsi(stderr)).toMatchInlineSnapshot(`
          "ℹ Validating password policies in: test/policy_fails ...
          - brokenPolicy.yaml
          ✖ brokenPolicy.yaml
          - contractItSelfPolicy.yaml
          ✔ contractItSelfPolicy.yaml"
        `);
    });
    test("mixed", async () => {
        const { exitCode, stderr } = await command(
            "node",
            ["./bin/cli.js", "validate-policies", "-p", "test/policy_fails", "test/policy_success"],
            { reject: false },
        );

        expect(exitCode).toBe(1);
        return expect(stripAnsi(stderr)).toMatchInlineSnapshot(`
          "ℹ Validating password policies in: test/policy_fails ...
          - brokenPolicy.yaml
          ✖ brokenPolicy.yaml
          - contractItSelfPolicy.yaml
          ✔ contractItSelfPolicy.yaml
          ℹ Validating password policies in: test/policy_success ...
          - mittwald.yaml
          ✔ mittwald.yaml
          - subDir/anotherPolicy.yaml
          ✔ subDir/anotherPolicy.yaml
          - testPolicy.yaml
          ✔ testPolicy.yaml
          - testPolicyFull.yaml
          ✔ testPolicyFull.yaml"
        `);
    });
    test("recursive", async () => {
        const { exitCode, stderr } = await command("node", ["./bin/cli.js", "validate-policies", "-p", "test"], {
            reject: false,
        });

        expect(exitCode).toBe(1);
        return expect(stripAnsi(stderr)).toMatchInlineSnapshot(`
          "ℹ Validating password policies in: test ...
          - policy_fails/brokenPolicy.yaml
          ✖ policy_fails/brokenPolicy.yaml
          - policy_fails/contractItSelfPolicy.yaml
          ✔ policy_fails/contractItSelfPolicy.yaml
          - policy_success/mittwald.yaml
          ✔ policy_success/mittwald.yaml
          - policy_success/subDir/anotherPolicy.yaml
          ✔ policy_success/subDir/anotherPolicy.yaml
          - policy_success/testPolicy.yaml
          ✔ policy_success/testPolicy.yaml
          - policy_success/testPolicyFull.yaml
          ✔ policy_success/testPolicyFull.yaml"
        `);
    });
    test("silent", async () => {
        const { exitCode, stderr } = await command("node", ["./bin/cli.js", "validate-policies", "-p", "test", "-s"], {
            reject: false,
        });

        expect(exitCode).toBe(1);
        return expect(stderr).toBe("");
    });
    test("verbose", async () => {
        const { exitCode, stderr } = await command("node", ["./bin/cli.js", "validate-policies", "-p", "test", "-v"], {
            reject: false,
        });

        expect(exitCode).toBe(1);
        return expect(stripAnsi(stderr)).toMatchInlineSnapshot(`
          "ℹ Validating password policies in: test ...
          - policy_fails/brokenPolicy.yaml
          ✖ policy_fails/brokenPolicy.yaml
            Error: must have required property 'ruleType',must have required property 'charPools',must have required property 'chars',must have required property 'pattern',must have required property 'blocklist',must have required property 'ruleType',must have required property 'ruleType',must match a schema in anyOf
          - policy_fails/contractItSelfPolicy.yaml
          ✔ policy_fails/contractItSelfPolicy.yaml
          - policy_success/mittwald.yaml
          ✔ policy_success/mittwald.yaml
          - policy_success/subDir/anotherPolicy.yaml
          ✔ policy_success/subDir/anotherPolicy.yaml
          - policy_success/testPolicy.yaml
          ✔ policy_success/testPolicy.yaml
          - policy_success/testPolicyFull.yaml
          ✔ policy_success/testPolicyFull.yaml"
        `);
    });
});
