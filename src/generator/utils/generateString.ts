import { mathRandomCrypto } from "./pickCryptographicallyRandomElement";

const availableCharsets: Record<string, string> = {
    lower: "abcdefghijklmnopqrstuvwxyz",
    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    number: "0123456789",
    special: "~!@#$%^&()_+-={}[];',.",
};

availableCharsets.all =
    availableCharsets.lower + availableCharsets.upper + availableCharsets.number + availableCharsets.special;

/**
 * Generate random character sequences of a specified `length`,
 * based on the given `pattern`.
 *
 * @param {String} `pattern` The pattern to use for generating the random string.
 * @param {String} `length` The length of the string to generate.
 * @param {String} `options`
 * @return {String}
 * @api public
 */

interface Options {
    chars?: string;
    exclude?: string | string[];
}

type GenerateString = (pattern?: string, length?: number, options?: Options) => string;

export const generateString: GenerateString = (
    pattern: string = "*",
    length: number = 13,
    options: Options = {},
): string => {
    let custom = false;

    if (options.chars) {
        pattern = options.chars;
        length = pattern.length;
        custom = true;
    }

    let mask = "";
    let generatedString = "";

    // Characters to be used
    if (pattern.includes("?")) mask += options.chars;
    if (pattern.includes("a")) mask += availableCharsets.lower;
    if (pattern.includes("A")) mask += availableCharsets.upper;
    if (pattern.includes("0")) mask += availableCharsets.number;
    if (pattern.includes("!")) mask += availableCharsets.special;
    if (pattern.includes("*")) mask += availableCharsets.all;
    if (custom) mask += pattern;

    // Characters to exclude
    if (options.exclude) {
        let exclude = typeof options.exclude === "string" ? options.exclude : options.exclude.join("");
        exclude = exclude.replace(new RegExp("[\\]]+", "g"), "");
        mask = mask.replace(new RegExp("[" + exclude + "]+", "g"), "");

        if (options.exclude.includes("]")) {
            mask = mask.replace(new RegExp("[\\]]+", "g"), "");
        }
    }

    while (length--) {
        generatedString += mask.charAt(mathRandomCrypto() * mask.length);
    }
    return generatedString;
};
