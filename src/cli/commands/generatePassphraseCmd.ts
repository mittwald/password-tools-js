import type { CommandModule } from "yargs";
import { Generator } from "../../generator/Generator";
import ora from "ora";
import { buildFromPolicyFile } from "../lib/buildFromPolicyFile.js";
import { PasswordGenerationError } from "../../errors";

interface GeneratePassphraseCmdArgs {
  policyPath: string;
  timeout: number;
  silent: boolean;
}

export const generatePassphraseCmd: CommandModule<
  unknown,
  GeneratePassphraseCmdArgs
> = {
  command: "generate-passphrase",
  describe: "Generates a passphrase from a policy",
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

    terminal.start("Generating passphrase...");
    try {
      const passphrase = await generator.generatePassphrase();
      terminal.stop();
      console.log(passphrase);
      process.exit(0);
    } catch (e: unknown) {
      if (e instanceof PasswordGenerationError) {
        terminal.fail(e.message);
      }
    }

    process.exit(1);
  },
};
