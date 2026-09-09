import type { CommandModule } from "yargs";
import { Generator } from "../../generator/Generator";
import ora from "ora";

export const generateAnyPassphraseCmd: CommandModule<
  unknown,
  { silent: boolean }
> = {
  command: "generate-any-passphrase",
  describe: "Generates any passphrase",
  builder: {},
  handler: async ({ silent }) => {
    const terminal = ora({
      isSilent: silent,
    });

    terminal.start("Generating passphrase...");
    const password = await Generator.generateAnyPassphrase();
    terminal.stop();

    console.log(password);
    process.exit(0);
  },
};
