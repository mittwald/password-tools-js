import type { CommandModule } from "yargs";
import { Generator } from "../../generator/Generator";
import ora from "ora";

export const generateAnyPasswordCmd: CommandModule<
  unknown,
  { silent: boolean }
> = {
  command: "generate-any-password",
  describe: "Generates any password",
  builder: {},
  handler: async ({ silent }) => {
    const terminal = ora({
      isSilent: silent,
    });

    terminal.start("Generating password...");
    const password = await Generator.generateAnyPassword();
    terminal.stop();

    console.log(password);
    process.exit(0);
  },
};
