export const getCryptoApi = (): Crypto => {
  if (
    /* global globalThis */
    typeof globalThis.crypto !== "undefined" &&
    typeof globalThis.crypto.getRandomValues === "function"
  ) {
    return globalThis.crypto;
  }

  throw new Error("Crypto API not available. Abort.");
};

/**
 * Whether a cryptographically secure random source is available.
 *
 * Deliberately a function rather than a module-level constant: it keeps the
 * module free of import-time side effects, and the answer is re-checked at the
 * point of use instead of being frozen when the module first loaded.
 */
export const isCryptographicSecureRandom = (): boolean => {
  try {
    getCryptoApi();
    return true;
  } catch {
    return false;
  }
};
