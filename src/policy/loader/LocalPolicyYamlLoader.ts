import { PolicyNotFoundError } from "../../errors.js";
import { yamlFileToObject } from "../lib/yamlFileToObject.js";
import type { PolicyLoader } from "./PolicyLoader.js";
import jetpack from "../../util/jetpack.js";
import path from "path";
import type { PolicyDeclaration } from "../declaration.js";

export class LocalPolicyYamlLoader implements PolicyLoader {
    public readonly baseDir: string;

    public constructor(baseDir: string) {
        this.baseDir = baseDir;
    }

    public loadPolicy(name: string): PolicyDeclaration {
        const relativeFilePaths = jetpack.cwd(this.baseDir).find({
            recursive: true,
            matching: `${name}.yaml`,
        });

        if (relativeFilePaths.length === 0 || !relativeFilePaths[0]) {
            throw new PolicyNotFoundError(name);
        }

        if (relativeFilePaths.length > 1) {
            throw new PolicyNotFoundError(name, new Error(`Duplicate file entries (${relativeFilePaths.join(", ")})`));
        }

        const filename = path.join(this.baseDir, relativeFilePaths[0]);

        try {
            return yamlFileToObject(filename) as PolicyDeclaration;
        } catch (error: any) {
            throw new PolicyNotFoundError(name, error);
        }
    }
}
