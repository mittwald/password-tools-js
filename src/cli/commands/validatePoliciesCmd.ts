import { LocalPolicyYamlLoader } from "../../policy/loader/LocalPolicyYamlLoader";
import ora from "ora";
import path from "path";
import { Policy } from "../../policy/Policy";
import type { CommandModule } from "yargs";
import jetpack from "../../util/jetpack";

const validatePoliciesAndLogResults = (policiesPath: string): boolean => {
    const relativeFileNames = jetpack.cwd(policiesPath).find({ recursive: true });

    const localFilePolicyLoader = new LocalPolicyYamlLoader(policiesPath);

    ora().info(`Validating password policies in: ${policiesPath} ...`);

    let allValid = true;

    for (const filename of relativeFileNames) {
        const o = ora();
        o.text = filename;
        o.start();

        const policyName = path.basename(filename, ".yaml");
        const policyDeclaration = localFilePolicyLoader.loadPolicy(policyName);

        try {
            Policy.assertValidDeclaration(policyDeclaration);
            o.succeed();
        } catch (e) {
            o.fail(`${filename}: ${e}`);
            allValid = false;
        }
    }

    return allValid;
};

interface ValidatePoliciesCmdArgs {
    paths: string[];
}

export const validatePoliciesCmd: CommandModule<unknown, ValidatePoliciesCmdArgs> = {
    command: "validate-policies",
    describe: "Validates all policies in the provided paths",
    builder: {
        policyPaths: {
            alias: ["P", "paths"],
            type: "string",
            array: true,
            demandOption: true,
            describe: "The paths to your policy-directories",
        },
    },
    handler: (argv) => {
        const { paths } = argv;

        let allPoliciesInAllPathsAreValid = true;

        for (const path of paths) {
            const policiesInPathAreValid = validatePoliciesAndLogResults(path.toString());

            if (!policiesInPathAreValid) {
                allPoliciesInAllPathsAreValid = false;
            }
        }

        if (!allPoliciesInAllPathsAreValid) {
            process.exit(1);
        }
    },
};
