import { vi, vitest } from "vitest";
import { describe, expect, test, beforeEach } from "vitest";

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

beforeEach(() => axiosGet.mockReset());

import { HibpRule } from "./HibpRule.js";
import { RuleType } from "../declaration.js";
import { mock123, mockConsultCitation2Reformer } from "./mocks/mockAxiosResponse.js";

describe(`${HibpRule.name}.options`, () => {
    test("default url", async () => {
        axiosGet.mockReturnValue(Promise.resolve({ data: "asd" }));
        await new HibpRule({}).validate("123");
        expect(axiosGet).toBeCalledWith("https://api.pwnedpasswords.com/range/40bd0");
    });
    test("custom endpoint", async () => {
        axiosGet.mockReturnValue(Promise.resolve({ data: "asd" }));
        await new HibpRule({ endpointUrl: "http://example.com/{hashPrefix}/hibp" }).validate("123");
        expect(axiosGet).toBeCalledWith("http://example.com/40bd0/hibp");
    });
});
describe(`${HibpRule.name}.validatePassword()`, () => {
    test("false -> pw is pwned", async () => {
        axiosGet.mockReturnValue(Promise.resolve({ data: mock123 }));

        const result = await new HibpRule({}).validate("123");
        expect(result).toStrictEqual({
            isValid: false,
            ruleType: RuleType.hibp,
        });
    });
    test("true -> pw is not pwned", async () => {
        axiosGet.mockReturnValue(Promise.resolve({ data: mockConsultCitation2Reformer }));

        const result = await new HibpRule({}).validate("Consult-Citation2-Reformer");
        expect(result).toStrictEqual({
            isValid: true,
            ruleType: RuleType.hibp,
        });
    });
});
