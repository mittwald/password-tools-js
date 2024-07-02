import type { CommandModule } from "yargs";
import { Generator } from "../../generator/Generator";

export const generateAnyPassphraseCmd: CommandModule = {
    command: "generate-any-passphrase",
    describe: "Generates any passphrase",
    builder: {},
    handler: () => console.log(`Passphrase: ${Generator.generateAnyPassphrase()}`),
};
