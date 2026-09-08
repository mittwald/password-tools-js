import { describe, expect, test, vi } from "vitest";
import { getCryptoApi, isCryptographicSecureRandom } from "./crypto.js";

describe("getCryptoApi", () => {
  test("returns the Web Crypto API", () => {
    expect(getCryptoApi()).toBe(globalThis.crypto);
    expect(isCryptographicSecureRandom()).toBe(true);
  });

  // The generator must refuse to produce passwords rather than fall back to a
  // non-cryptographic source, so the failure has to be a hard one.
  test("throws instead of degrading when no secure source exists", () => {
    vi.stubGlobal("crypto", undefined);
    try {
      expect(() => getCryptoApi()).toThrow();
      expect(isCryptographicSecureRandom()).toBe(false);
    } finally {
      vi.unstubAllGlobals();
    }
  });

  test("rejects a crypto object without getRandomValues", () => {
    vi.stubGlobal("crypto", {});
    try {
      expect(isCryptographicSecureRandom()).toBe(false);
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
