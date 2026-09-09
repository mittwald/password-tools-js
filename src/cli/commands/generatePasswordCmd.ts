import { Generator } from "../../generator/Generator";
import type { CommandModule } from "yargs";
import ora from "ora";
import { buildFromPolicyFile } from "../lib/buildFromPolicyFile.js";
import { PasswordGenerationError } from "../../errors";

interface GeneratePasswordCmdArgs {
  policyPath: string;
  timeout: number;
  silent: boolean;
}

export const generatePasswordCmd: CommandModule<
  unknown,
  GeneratePasswordCmdArgs
> = {
  command: "generate-password",
  describe: "Generates a password from a policy",
  builder: {
    timeout: {
      alias: ["t"],
      type: "number",
      default: 25,
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

    const generator = buildFromPolicyFile(
      terminal,
      policyPath,
      (declaration) =>
        new Generator(declaration, {
          timeout,
        }),
    );

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
