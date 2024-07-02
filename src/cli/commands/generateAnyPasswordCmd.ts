import type { CommandModule } from "yargs";
import { Generator } from "../../generator/Generator";

export const generateAnyPasswordCmd: CommandModule = {
    command: "generate-any-password",
    describe: "Generates any password",
    builder: {},
    handler: () => console.log(`Password: ${Generator.generateAnyPassword()}`),
};
