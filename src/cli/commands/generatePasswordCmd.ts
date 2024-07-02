import { yamlFileToObject } from "../../policy/lib/yamlFileToObject";
import type { PolicyDeclaration } from "../../policy/declaration";
import { Policy } from "../../policy/Policy";
import { Generator } from "../../generator/Generator";
import type { CommandModule } from "yargs";

interface GeneratePasswordCmdArgs {
    policyPath: string;
    timeout: number;
}

export const generatePasswordCmd: CommandModule<unknown, GeneratePasswordCmdArgs> = {
    command: "generate-password",
    describe: "Generates a password from a policy",
    builder: {
        timeout: {
            alias: ["T"],
            type: "number",
            default: 5,
            demandOption: false,
            describe: "Timeout in seconds for password generator",
        },
        policyPath: {
            alias: ["P", "path"],
            type: "string",
            demandOption: true,
            describe: "The path of your policy",
        },
    },
    handler: async (argv) => {
        const { policyPath, timeout } = argv;

        const policyDeclaration = yamlFileToObject(policyPath) as PolicyDeclaration;
        const policy = Policy.fromDeclaration(policyDeclaration);
        const generator = new Generator(policy, {
            timeout,
        });

        const password = await generator.generatePassword();

        console.log(`Password: ${password}`);
    },
};
