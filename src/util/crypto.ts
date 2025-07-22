export const getCryptoApi = (): Crypto => {
    if (
        /* global globalThis */
        typeof globalThis.crypto !== "undefined" &&
        typeof globalThis.crypto.getRandomValues === "function"
    ) {
        return globalThis.crypto;
    }

    if (typeof require !== "undefined") {
        try {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            return require("crypto").webcrypto;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_) {
            /* empty */
        }
    }

    throw new Error("Crypto API not available. Abort.");
};

export const isCryptographicSecureRandom = (() => {
    try {
        getCryptoApi();
        return true;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
        return false;
    }
})();
