import { execa as command } from "execa";
import { describe, expect, test } from "vitest";

describe("generateAnyPassphraseCmd", { timeout: 20000 }, () => {
  test("output", async () => {
    const { exitCode, stdout } = await command(
      "node",
      ["./bin/cli.js", "generate-any-passphrase"],
      {
        reject: false,
      },
    );

    expect(exitCode).toBe(0);
    expect(stdout).toBeTypeOf("string");
    expect(stdout.split("-")).toHaveLength(3);
  });
});
