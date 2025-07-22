import { execa as command } from "execa";
import { describe, expect, test } from "vitest";

describe("generateAnyPasswordCmd", { timeout: 20000 }, () => {
    test("output", async () => {
        const { exitCode, stdout } = await command("node", ["./bin/cli.js", "generate-any-password"], {
            reject: false,
        });

        expect(exitCode).toBe(0);
        expect(stdout).toBeTypeOf("string");
        expect(stdout).toHaveLength(16);
    });
});
