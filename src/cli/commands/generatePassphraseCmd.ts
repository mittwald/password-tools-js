import type { CommandModule } from "yargs";
import { yamlFileToObject } from "../../policy/lib/yamlFileToObject";
import type { PolicyDeclaration } from "../../policy/declaration";
import { Policy } from "../../policy/Policy";
import { Generator } from "../../generator/Generator";

interface GeneratePassphraseCmdArgs {
    policyPath: string;
    timeout: number;
}

export const generatePassphraseCmd: CommandModule<unknown, GeneratePassphraseCmdArgs> = {
    command: "generate-passphrase",
    describe: "Generates a passphrase from a policy",
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
        const passphrase = await generator.generatePassphrase();

        console.log(`Passphrase: ${passphrase}`);
    },
};
