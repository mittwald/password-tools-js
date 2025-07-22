import { execa as command } from "execa";
import { describe, expect, test } from "vitest";

describe(
    "validatePoliciesCmd",
    () => {
        test("output", async () => {
            const { exitCode, stderr } = await command("yarn", ["password-tools-js", "validate-policies"], {
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
            const { exitCode, stderr } = await command(
                "yarn",
                ["password-tools-js", "validate-policies", "-p", "notAdir"],
                { reject: false },
            );

            expect(exitCode).toBe(1);
            return expect(stderr).toMatchInlineSnapshot(`"[31m✖[39m Policy directory notAdir does not exists!"`);
        });
        test("success", async () => {
            const { exitCode, stderr } = await command(
                "yarn",
                ["password-tools-js", "validate-policies", "-p", "test/policy_success"],
                { reject: false },
            );

            expect(exitCode).toBe(0);
            return expect(stderr).toMatchInlineSnapshot(`
              "[34mℹ[39m Validating password policies in: test/policy_success ...
              - mittwald.yaml
              [32m✔[39m mittwald.yaml
              - subDir/anotherPolicy.yaml
              [32m✔[39m subDir/anotherPolicy.yaml
              - testPolicy.yaml
              [32m✔[39m testPolicy.yaml
              - testPolicyFull.yaml
              [32m✔[39m testPolicyFull.yaml"
            `);
        });
        test("fails", async () => {
            const { exitCode, stderr } = await command(
                "yarn",
                ["password-tools-js", "validate-policies", "-p", "test/policy_fails"],
                { reject: false },
            );

            expect(exitCode).toBe(1);
            return expect(stderr).toMatchInlineSnapshot(`
              "[34mℹ[39m Validating password policies in: test/policy_fails ...
              - brokenPolicy.yaml
              [31m✖[39m brokenPolicy.yaml
              - contractItSelfPolicy.yaml
              [32m✔[39m contractItSelfPolicy.yaml"
            `);
        });
        test("mixed", async () => {
            const { exitCode, stderr } = await command(
                "yarn",
                ["password-tools-js", "validate-policies", "-p", "test/policy_fails", "test/policy_success"],
                { reject: false },
            );

            expect(exitCode).toBe(1);
            return expect(stderr).toMatchInlineSnapshot(`
              "[34mℹ[39m Validating password policies in: test/policy_fails ...
              - brokenPolicy.yaml
              [31m✖[39m brokenPolicy.yaml
              - contractItSelfPolicy.yaml
              [32m✔[39m contractItSelfPolicy.yaml
              [34mℹ[39m Validating password policies in: test/policy_success ...
              - mittwald.yaml
              [32m✔[39m mittwald.yaml
              - subDir/anotherPolicy.yaml
              [32m✔[39m subDir/anotherPolicy.yaml
              - testPolicy.yaml
              [32m✔[39m testPolicy.yaml
              - testPolicyFull.yaml
              [32m✔[39m testPolicyFull.yaml"
            `);
        });
        test("recursive", async () => {
            const { exitCode, stderr } = await command(
                "yarn",
                ["password-tools-js", "validate-policies", "-p", "test"],
                { reject: false },
            );

            expect(exitCode).toBe(1);
            return expect(stderr).toMatchInlineSnapshot(`
              "[34mℹ[39m Validating password policies in: test ...
              - policy_fails/brokenPolicy.yaml
              [31m✖[39m policy_fails/brokenPolicy.yaml
              - policy_fails/contractItSelfPolicy.yaml
              [32m✔[39m policy_fails/contractItSelfPolicy.yaml
              - policy_success/mittwald.yaml
              [32m✔[39m policy_success/mittwald.yaml
              - policy_success/subDir/anotherPolicy.yaml
              [32m✔[39m policy_success/subDir/anotherPolicy.yaml
              - policy_success/testPolicy.yaml
              [32m✔[39m policy_success/testPolicy.yaml
              - policy_success/testPolicyFull.yaml
              [32m✔[39m policy_success/testPolicyFull.yaml"
            `);
        });
        test("silent", async () => {
            const { exitCode, stderr } = await command(
                "yarn",
                ["password-tools-js", "validate-policies", "-p", "test", "-s"],
                { reject: false },
            );

            expect(exitCode).toBe(1);
            return expect(stderr).toBe("");
        });
        test("verbose", async () => {
            const { exitCode, stderr } = await command(
                "yarn",
                ["password-tools-js", "validate-policies", "-p", "test", "-v"],
                { reject: false },
            );

            expect(exitCode).toBe(1);
            return expect(stderr).toMatchInlineSnapshot(`
              "[34mℹ[39m Validating password policies in: test ...
              - policy_fails/brokenPolicy.yaml
              [31m✖[39m policy_fails/brokenPolicy.yaml
                Error: must have required property 'ruleType',must have required property 'charPools',must have required property 'chars',must have required property 'pattern',must have required property 'blocklist',must have required property 'ruleType',must have required property 'ruleType',must match a schema in anyOf
              - policy_fails/contractItSelfPolicy.yaml
              [32m✔[39m policy_fails/contractItSelfPolicy.yaml
              - policy_success/mittwald.yaml
              [32m✔[39m policy_success/mittwald.yaml
              - policy_success/subDir/anotherPolicy.yaml
              [32m✔[39m policy_success/subDir/anotherPolicy.yaml
              - policy_success/testPolicy.yaml
              [32m✔[39m policy_success/testPolicy.yaml
              - policy_success/testPolicyFull.yaml
              [32m✔[39m policy_success/testPolicyFull.yaml"
            `);
        });
    },
    { timeout: 20000 },
);
