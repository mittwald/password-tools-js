import { vi, vitest } from "vitest";
import { describe, expect, test, beforeEach } from "vitest";
import { HaveIBeenPwnedClient } from "./HaveIBeenPwnedClient";
import { createHash } from "sha1-uint8array";

const axiosGet = vitest.fn();
vi.mock("axios", async () => {
    const actualAxios = await vi.importActual("axios");

    return {
        ...actualAxios,
        default: {
            create: () => ({
                get: axiosGet,
            }),
        },
    };
});

const client = new HaveIBeenPwnedClient();

beforeEach(() => {
    axiosGet.mockReset();
});

const password = "123456";
const passwordHashSuffixWithCount = `${createHash().update(password).digest("hex").slice(5).toUpperCase()}:1`;

describe("isPasswordLeaked()", () => {
    test("returns true if hash-suffix is in HIBP response", async () => {
        axiosGet.mockReturnValue(
            Promise.resolve({
                data: [passwordHashSuffixWithCount, "foo:1", "bar:3"].join("\n"),
            }),
        );
        const leaked = await client.isPasswordLeaked(password);
        expect(leaked).toBe(true);
    });
    test("returns false if hash-suffix is not in HIBP response", async () => {
        axiosGet.mockReturnValue(
            Promise.resolve({
                data: ["foo:1", "bar:3"].join("\n"),
            }),
        );
        const leaked = await client.isPasswordLeaked(password);
        expect(leaked).toBe(false);
    });
});
