import type { AxiosResponse } from "axios";
import { AxiosError } from "axios";
import { vi, vitest, describe, expect, test } from "vitest";
import { RemotePolicyLoader } from "./RemotePolicyLoader.js";

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

const remotePolicyLoader = new RemotePolicyLoader("myUrl");

describe(remotePolicyLoader.loadPolicy.name, () => {
    const examplePolicy = { foo: "bar" };

    test("returns requested policy as object", async () => {
        axiosGet.mockResolvedValue({ data: examplePolicy });
        expect(await remotePolicyLoader.loadPolicy("examplePolicy")).toEqual(examplePolicy);
    });

    test("throws PolicyNotFoundError, on HTTP status 404", () => {
        axiosGet.mockRejectedValue(
            new AxiosError("Request failed with status code 404", "error", undefined, undefined, {
                status: 404,
            } as AxiosResponse),
        );

        return expect(remotePolicyLoader.loadPolicy("Foo")).rejects.toThrow(
            'Policy "Foo" not found: Request failed with status code 404',
        );
    });
});
