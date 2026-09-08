import { getRandomArrayItem } from "./randomNumber";

export const availableCharsets: Record<string, string> = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  number: "0123456789",
  special: "~!@#$%^&()_+-={}[];',.",
};

availableCharsets.all =
  availableCharsets.lower +
  availableCharsets.upper +
  availableCharsets.number +
  availableCharsets.special;

interface Options {
  chars?: string;
  exclude?: string[];
  customPattern?: string;
}

type RandomString = (
  length: number,
  pattern?: string,
  options?: Options,
) => Promise<string>;

/**
 * Generate random character sequences of a specified `length`, based on the
 * given `pattern`.
 *
 * @param {String} `pattern` The pattern to use for generating the random
 *   string.
 * @param {String} `length` The length of the string to generate.
 * @param {String} `options`
 * @returns {String}
 */
export const randomString: RandomString = (
  length: number,
  pattern: string = "*",
  options: Options = {},
): Promise<string> => {
  return new Promise((resolve) => {
    let mask = "";

    if (pattern.includes("?") && options.chars) {
      mask += options.chars;
    }
    if (pattern.includes("a")) {
      mask += availableCharsets.lower;
    }
    if (pattern.includes("A")) {
      mask += availableCharsets.upper;
    }
    if (pattern.includes("0")) {
      mask += availableCharsets.number;
    }
    if (pattern.includes("!")) {
      mask += availableCharsets.special;
    }
    if (pattern.includes("*")) {
      mask += availableCharsets.all;
    }
    if (options.customPattern) {
      mask += pattern;
    }

    mask = [...new Set(mask)].join("");

    const excluded = new Set((options.exclude ?? []).join(""));
    if (excluded.size) {
        mask = [...mask].filter((char) => !excluded.has(char)).join("");
    }

    if (!mask.length) {
      throw new Error("No valid characters available for generation.");
    }

    let result = "";
    for (let i = 0; i < length; i++) {
      result += getRandomArrayItem(mask);
    }

    resolve(result);
  });
};
