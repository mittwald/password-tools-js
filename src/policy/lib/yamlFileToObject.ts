import { parse } from "yaml";
import { FileNotFoundError } from "../../errors.js";
import jetpack from "../../util/jetpack.js";

export const yamlFileToObject = (filePath: string): object => {
    const policyAsYamlString = jetpack.read(filePath);

    if (policyAsYamlString === undefined) {
        throw new FileNotFoundError(filePath);
    }

    return parse(policyAsYamlString);
};
