import yargs from "yargs";
import { hideBin } from "yargs/helpers";
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

await yargs(hideBin(process.argv))
    .scriptName("password-validation")
    .usage("$0 <cmd> [options]")
    .command(validatePoliciesCmd)
    .example("validate-policies", "-P my/policies/ foo/anotherPolicyDir/")
    .command(validatePasswordsCmd)
    .example(
        "validate-passwords",
        "-P policies/examplePolicy.yaml -p myPassword anotherPw (optional: --booleanOnly; or -b)",
    )
    .command(generatePasswordCmd)
    .example("generate-password", "-P policies/examplePolicy.yaml")
    .command(generateAnyPasswordCmd)
    .example("generate-any-password", "")
    .command(generatePassphraseCmd)
    .example("generate-passphrase", "-P policies/examplePolicy.yaml")
    .command(generateAnyPassphraseCmd)
    .example("generate-any-passphrase", "")
    .demandCommand(1, 2, "Choose one of the commands above ^")
    .wrap(yargs().terminalWidth())
    .strict()
    .version(false)
    .locale("en")
    .help(false)
    .parse();
