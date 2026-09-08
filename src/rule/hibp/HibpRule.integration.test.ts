import { describe, expect, test } from "vitest";
import { HibpRule } from "./HibpRule.js";

describe(`${HibpRule.name}.integration.axios`, { timeout: 10000 }, () => {
  test("will obey succeedOnError when run in timeout", async () => {
    expect(
      (
        await new HibpRule({
          // not reachable url
          endpointUrl: "http://10.255.255.1/",
          willSucceedOnError: true,
        }).validate("123")
      ).isValid,
    ).toBeTruthy();
  });
});
