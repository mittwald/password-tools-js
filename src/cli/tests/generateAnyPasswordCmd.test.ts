import { execa as command } from "execa";
import { describe, expect, test } from "vitest";

describe(
    "generateAnyPasswordCmd",
    () => {
        test("output", async () => {
            const { exitCode, stdout } = await command("yarn", ["password-tools-js", "generate-any-password"], {
                reject: false,
            });

            expect(exitCode).toBe(0);
            expect(stdout).toBeTypeOf("string");
            expect(stdout).toHaveLength(16);
        });
    },
    { timeout: 20000 },
);
