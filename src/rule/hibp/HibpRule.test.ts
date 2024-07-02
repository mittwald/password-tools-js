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

beforeEach(() => axiosGet.mockReset());

import { HibpRule } from "./HibpRule.js";
import { RuleType } from "../declaration.js";
import { mock123, mockConsultCitation2Reformer } from "./mocks/mockAxiosResponse.js";

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
