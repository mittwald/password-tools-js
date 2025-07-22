import { Generator } from "../../generator/Generator";
import type { CommandModule } from "yargs";
import jetpack from "fs-jetpack";
import ora from "ora";
import { PasswordGenerationError } from "../../errors";

interface GeneratePasswordCmdArgs {
    policyPath: string;
    timeout: number;
    silent: boolean;
}

export const generatePasswordCmd: CommandModule<unknown, GeneratePasswordCmdArgs> = {
    command: "generate-password",
    describe: "Generates a password from a policy",
    builder: {
        timeout: {
            alias: ["t"],
            type: "number",
            default: 5,
            demandOption: false,
            describe: "Timeout in seconds for password generator",
        },
        policyPath: {
            alias: ["p", "path"],
            type: "string",
            demandOption: true,
            describe: "The path of your policy",
        },
    },
    handler: async ({ policyPath, timeout, silent }) => {
        const terminal = ora({
            isSilent: silent,
        });

        if (jetpack.exists(policyPath) !== "file") {
            terminal.fail(`Policy file ${policyPath} does not exists!`);
            process.exit(1);
        }

        const generator = new Generator(jetpack.read(policyPath), {
            timeout,
        });

        terminal.start("Generating password...");
        try {
            const password = await generator.generatePassword();
            terminal.stop();
            console.log(password);
            process.exit(0);
        } catch (e: unknown) {
            if (e instanceof PasswordGenerationError) {
                terminal.fail(e.message);
            }
        }

        process.exit(1);
    },
};
