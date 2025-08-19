import { OneOfRegexFlags } from "../declaration.js";

export const createRegExp = (
  regex: string,
  flags: OneOfRegexFlags[] | undefined,
  setGlobal?: boolean,
): RegExp => {
  const flagsStringArray: string[] = flags ?? [];
  if (setGlobal) {
    flagsStringArray.push("g");
  }

  const flagsUnique = [...new Set(flagsStringArray)];
  const flagsString = flagsUnique.join("");
  return RegExp(regex, flagsString);
};
