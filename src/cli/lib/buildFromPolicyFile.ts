import jetpack from "fs-jetpack";
import type { Ora } from "ora";

/**
 * Reads a policy file and hands its contents to `build`.
 *
 * Both ways this fails are the user's problem rather than a defect -- the file
 * is missing, or the policy does not describe a valid policy -- so each is
 * reported as a message and ends the process instead of escaping as an
 * unhandled exception.
 */
export const buildFromPolicyFile = <T>(
  terminal: Ora,
  policyPath: string,
  build: (declaration: string) => T,
): T => {
  if (jetpack.exists(policyPath) !== "file") {
    terminal.fail(`Policy file ${policyPath} does not exists!`);
    process.exit(1);
  }

  try {
    return build(jetpack.read(policyPath) ?? "");
  } catch (error: unknown) {
    const reason = error instanceof Error ? error.message : String(error);
    terminal.fail(`Policy file ${policyPath} is not valid: ${reason}`);
    process.exit(1);
  }
};
