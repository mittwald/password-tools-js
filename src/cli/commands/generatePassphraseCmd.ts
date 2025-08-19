import type { CommandModule } from "yargs";
import { Generator } from "../../generator/Generator";
import jetpack from "fs-jetpack";
import ora from "ora";
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
