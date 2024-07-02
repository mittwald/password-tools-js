import sha1 from "../../../util/sha1.js";
import { vi, vitest } from "vitest";
import { describe, expect, test, beforeEach } from "vitest";

const axiosGet = vitest.fn();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

// eslint-disable-next-line @typescript-eslint/naming-convention
const { HaveIBeenPwnedClient } = await import("./HaveIBeenPwnedClient.js");

const client = new HaveIBeenPwnedClient();

beforeEach(() => {
    axiosGet.mockReset();
});

const password = "123456";
const passwordHashSuffixWithCount = `${sha1.hex(password).toString().slice(5).toUpperCase()}:1`;

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
