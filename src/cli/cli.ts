import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { readFileSync } from "node:fs";
import PrettyError from "pretty-error";
import { validatePoliciesCmd } from "./commands/validatePoliciesCmd";
import { validatePasswordsCmd } from "./commands/validatePasswordsCmd";
import { generatePasswordCmd } from "./commands/generatePasswordCmd";
import { generateAnyPasswordCmd } from "./commands/generateAnyPasswordCmd";
import { generatePassphraseCmd } from "./commands/generatePassphraseCmd";
import { generateAnyPassphraseCmd } from "./commands/generateAnyPassphraseCmd";

const pe = new PrettyError();
pe.skipNodeFiles();
pe.start();

const { version } = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
) as { version: string };

await yargs(hideBin(process.argv))
  .scriptName("password-tools-js")
  .usage("$0 <cmd> [options]")
  .option("s", {
    alias: "silent",
    type: "boolean",
    default: false,
    global: true,
  })
  .option("v", {
    alias: "verbose",
    type: "boolean",
    default: false,
    global: true,
  })
  .command(validatePoliciesCmd)
  .example("validate-policies", "-p <policyDirectory> [<policyDirectory>...]")
  .command(validatePasswordsCmd)
  .example("validate-passwords", "-p <policy> -P <password> [<password>...]")
  .command(generatePasswordCmd)
  .example("generate-password", "-p <policy>")
  .command(generateAnyPasswordCmd)
  .example("generate-any-password", "")
  .command(generatePassphraseCmd)
  .example("generate-passphrase", "-p <policy>")
  .command(generateAnyPassphraseCmd)
  .example("generate-any-passphrase", "")
  .demandCommand(1, 2, "Choose one of the commands above ^")
  .wrap(yargs().terminalWidth())
  .strict()
  .version(version)
  .locale("en")
  .help()
  .parse();
