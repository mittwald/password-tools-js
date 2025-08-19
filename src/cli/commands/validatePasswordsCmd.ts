import type { CommandModule } from "yargs";
import { Policy } from "../../policy/Policy";
import jetpack from "fs-jetpack";
import ora from "ora";

interface ValidatePasswordCmdArgs {
  policyPath: string;
  passwords: string[];
  silent: boolean;
  verbose: boolean;
}

export const validatePasswordsCmd: CommandModule<
  unknown,
  ValidatePasswordCmdArgs
> = {
  command: "validate-passwords",
  describe: "Validates passwords against the provided policy",
  builder: {
    policyPath: {
      alias: ["p", "path"],
      type: "string",
      demandOption: true,
      describe: "The path of your policy",
    },
    passwords: {
      alias: ["P", "pw"],
      type: "string",
      array: true,
      demandOption: true,
    },
  },
  handler: async (argv) => {
    const { policyPath, passwords, silent, verbose } = argv;
    let exitCode = 0;
    const terminal = ora({
      isSilent: silent,
    });

    if (jetpack.exists(policyPath) !== "file") {
      terminal.fail(`Policy file ${policyPath} does not exists!`);
      process.exit(1);
    }

    const policy = Policy.fromDeclaration(jetpack.read(policyPath));
    for (const password of passwords) {
      terminal.start(`Verifying password...`);

      const result = await policy.validate(password);

      if (result.isValid) {
        if (typeof result.isValid === "object" && "then" in result.isValid) {
          result.isValid = await result.isValid;
        }
      }

      if (result.isValid) {
        terminal.succeed(`${password}`);
      } else {
        exitCode = 1;
        if (verbose) {
          terminal.fail(`${password}`).stopAndPersist({
            text: JSON.stringify(result, null, 2),
          });
        } else {
          terminal.fail(`${password}`);
        }
      }
    }

    process.exit(exitCode);
  },
};
