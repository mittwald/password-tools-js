import { execa as command } from "execa";
import { describe, expect, test } from "vitest";

describe(
    "generateAnyPassphraseCmd",
    () => {
        test("output", async () => {
            const { exitCode, stdout } = await command("yarn", ["password-tools-js", "generate-any-passphrase"], {
                reject: false,
            });

            expect(exitCode).toBe(0);
            expect(stdout).toBeTypeOf("string");
            expect(stdout.split("-")).toHaveLength(3);
        });
    },
    { timeout: 20000 },
);
