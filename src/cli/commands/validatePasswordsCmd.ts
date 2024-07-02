import type { CommandModule } from "yargs";
import { yamlFileToObject } from "../../policy/lib/yamlFileToObject";
import type { PolicyDeclaration } from "../../policy/declaration";
import { Policy } from "../../policy/Policy";

interface ValidatePasswordCmdArgs {
    policyPath: string;
    passwords: string[];
    booleanOnly?: boolean;
}

export const validatePasswordsCmd: CommandModule<unknown, ValidatePasswordCmdArgs> = {
    command: "validate-passwords",
    describe: "Validates passwords against the provided policy",
    builder: {
        policyPath: {
            alias: ["P", "path"],
            type: "string",
            demandOption: true,
            describe: "The path of your policy",
        },
        passwords: {
            alias: ["p", "pw"],
            type: "string",
            array: true,
            demandOption: true,
        },
        booleanOnly: {
            alias: ["b", "bool"],
            type: "boolean",
            default: false,
        },
    },
    handler: async (argv) => {
        const { policyPath, passwords, booleanOnly } = argv;

        const policyDeclaration = yamlFileToObject(policyPath) as PolicyDeclaration;
        const policy = Policy.fromDeclaration(policyDeclaration);

        for (const password of passwords) {
            const result = policy.validate(password);

            const res = booleanOnly ? await result.isValid : JSON.stringify(result, null, 2);

            console.log(`Password: ${password} -> Result: ${res}`);
        }
    },
};
