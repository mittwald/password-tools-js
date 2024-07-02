import { LocalPolicyYamlLoader } from "./LocalPolicyYamlLoader.js";
import jetpack from "../../util/jetpack.js";
import { parse } from "yaml";
import { PolicyNotFoundError } from "../../errors.js";
import { describe, expect, test } from "vitest";

const policyAsYamlString = jetpack.read("test/testPolicy.yaml", "utf8");
const localTestPolicyYaml = parse(policyAsYamlString ?? "");

const localFilePolicyLoader = new LocalPolicyYamlLoader("test");

describe("LocalFilePolicyLoader", () => {
    test("returns the provided policy", () => {
        expect(localFilePolicyLoader.loadPolicy("testPolicy")).toEqual(localTestPolicyYaml);
    });
    test("throws PolicyNotFoundError, when policy does not exist", () => {
        expect(() => localFilePolicyLoader.loadPolicy("Foo")).toThrowError(new PolicyNotFoundError("Foo") as Error);
    });
});
