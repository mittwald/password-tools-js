import ora from "ora";
import path from "path";
import { Policy } from "../../policy/Policy";
import type { CommandModule } from "yargs";
import { readFileSync, readdirSync } from "node:fs";
import { pathType } from "../lib/pathType.js";

interface ValidatePoliciesCmdArgs {
  paths: string[];
  silent: boolean;
  verbose: boolean;
}

export const validatePoliciesCmd: CommandModule<
  unknown,
  ValidatePoliciesCmdArgs
> = {
  command: "validate-policies",
  describe: "Validates all policies in the provided paths",
  builder: {
    policyPaths: {
      alias: ["p", "paths"],
      type: "string",
      array: true,
      demandOption: true,
      describe: "The paths to your policy-directories",
    },
  },
  handler: (argv) => {
    const { paths, silent, verbose } = argv;
    let exitCode = 0;
    const terminal = ora({
      isSilent: silent,
    });

    for (const policyPath of paths) {
      if (pathType(policyPath) !== "dir") {
        terminal.fail(`Policy directory ${policyPath} does not exists!`);
        process.exit(1);
      }

      const relativeFileNames = readdirSync(policyPath, { recursive: true })
        .map(String)
        .filter((name) => pathType(path.join(policyPath, name)) === "file")
        .sort();
      terminal.info(`Validating password policies in: ${policyPath} ...`);

      for (const filename of relativeFileNames) {
        terminal.start(filename);
        try {
          Policy.fromDeclaration(
            readFileSync(path.join(policyPath, filename), "utf8"),
          );
          terminal.succeed();
        } catch (e) {
          if (verbose) {
            terminal.fail(`${filename}`).stopAndPersist({
              text: String(e),
            });
          } else {
            terminal.fail(`${filename}`);
          }

          exitCode = 1;
        }
      }
    }

    process.exit(exitCode);
  },
};
