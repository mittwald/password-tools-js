import randomize from "randomatic";
import { wordList } from "./assets/wordlist";
import type { Policy } from "../policy/Policy";
import { CryptographicInsecurityError, PasswordGenerationError } from "../errors";
import type { CharPool } from "../rule/charpool/CharPoolRule";
import { CharPoolRule } from "../rule/charpool/CharPoolRule";
import {
    getCryptographicallyRandomIndex,
    pickCryptographicallyRandomElement,
} from "./utils/pickCryptographicallyRandomElement";
import { matchEveryCharThatIsALetter, matchEveryCharThatIsNotALetter } from "./utils/regExps";
import { BlocklistRule } from "../rule/blocklist/BlocklistRule";
import { CharRule } from "../rule/char/CharRule";
import { LengthRule } from "../rule/length/LengthRule";
import { toTitleCase } from "./utils/toTitleCase";

export interface PassphraseOptions {
    desiredNumberOfWords: number;
    separator: string;
    useTitleCase: boolean;
    containNumber: boolean;
    containSpecial: boolean;
    demandedChars: string;
}

export interface GeneratorOptions {
    /** Timeout in milliseconds to throw an error when no password could be generated in time */
    timeout: number;
}

export class Generator {
    private readonly policy: Policy;
    private readonly options: GeneratorOptions;
    private static readonly fallbackLength = 16;

    public constructor(policy: Policy, options?: GeneratorOptions) {
        this.policy = policy;
        this.options = options ?? {
            timeout: 5,
        };
    }

    public static generateAnyPassword(): string {
        if (!randomize.isCrypto) {
            throw CryptographicInsecurityError;
        }

        return randomize("*", Generator.fallbackLength);
    }

    public async generatePassword(): Promise<string> {
        if (!randomize.isCrypto) {
            throw CryptographicInsecurityError;
        }

        const { pattern, chars, exclude } = this.translatePolicyRestrictionsForPasswordGeneration();
        const length = this.getMinLength();

        return this.generate(() => randomize(pattern, length, { chars, exclude }));
    }

    private readonly getMinLength = (): number => {
        const min = this.getLongestMinLength();
        const max = this.getShortestMaxLength();

        const fallback = this.policy.minComplexity <= 3 ? Generator.fallbackLength : 20;

        if (max && fallback > max) {
            return max;
        }
        if (min && min < fallback) {
            return fallback;
        }
        return min || fallback;
    };

    private readonly getLongestMinLength = (): number | undefined => {
        const lengthRulesWithMin = this.policy.rules.filter(
            (rule) => rule instanceof LengthRule && rule.config.min,
        ) as LengthRule[];

        return lengthRulesWithMin.length === 0
            ? undefined
            : Math.max(...lengthRulesWithMin.map((rule) => rule.config.min!));
    };

    private readonly getShortestMaxLength = (): number | undefined => {
        const lengthRulesWithMin = this.policy.rules.filter(
            (rule) => rule instanceof LengthRule && rule.config.max,
        ) as LengthRule[];

        return lengthRulesWithMin.length === 0
            ? undefined
            : Math.min(...lengthRulesWithMin.map((rule) => rule.config.max!));
    };

    private readonly translatePolicyRestrictionsForPasswordGeneration = (): {
        pattern: string;
        chars: string;
        exclude: string;
    } => {
        const pattern = this.removeForbiddenCharPoolsFromPattern("aA0!?", this.getForbiddenCharPools());
        const chars = this.getDemandedChars();
        const exclude = this.getForbiddenChars();

        return { pattern, chars, exclude };
    };

    private readonly getForbiddenCharPools = (): CharPool[] => {
        const rulesWithForbiddenCharPools = this.policy.rules.filter(
            (rule) => rule instanceof CharPoolRule && rule.config.max === 0,
        ) as CharPoolRule[];

        return rulesWithForbiddenCharPools.map((rule) => rule.config.charPools).flat();
    };

    private readonly removeForbiddenCharPoolsFromPattern = (
        pattern: string,
        forbiddenCharPools: CharPool[],
    ): string => {
        let newPattern = pattern;

        for (const charPool of forbiddenCharPools) {
            switch (charPool) {
                case "uppercase":
                    newPattern = newPattern.replace("A", "");
                    break;
                case "lowercase":
                    newPattern = newPattern.replace("a", "");
                    break;
                case "numbers":
                    newPattern = newPattern.replace("0", "");
                    break;
                case "special":
                    newPattern = newPattern.replace("!", "");
                    break;
                case "nonAscii":
                    break;
            }
        }

        return newPattern;
    };

    private readonly getForbiddenChars = (): string => {
        const rulesWithForbiddenCharPools = this.policy.rules.filter(
            (rule) => rule instanceof CharRule && rule.config.max === 0,
        ) as CharRule[];

        return rulesWithForbiddenCharPools.map((rule) => rule.config.chars).join("");
    };

    public static generateAnyPassphrase(): string {
        return this.buildPassphrase(wordList, {});
    }

    public async generatePassphrase(): Promise<string> {
        const { options, filteredWordlist } = this.translatePolicyRestrictionsForPassphraseGeneration();

        return this.generate(() => Generator.buildPassphrase(filteredWordlist, options));
    }

    private readonly translatePolicyRestrictionsForPassphraseGeneration = (): {
        options: Partial<PassphraseOptions>;
        filteredWordlist: string[];
    } => {
        const forbiddenChars = this.getForbiddenChars();
        const blocklist = this.getBlocklistedWords();
        const demandedChars = this.getDemandedChars();

        const filteredWordlist = Generator.filterWordlist(wordList, forbiddenChars, demandedChars, blocklist);
        const options = this.getPassphraseOptionsFromPolicy();

        return { options, filteredWordlist };
    };

    private readonly getBlocklistedWords = (): string[] => {
        const blocklistRules = this.policy.rules.filter((rule) => rule instanceof BlocklistRule);

        return blocklistRules.flatMap((rule) => rule.config.blocklist);
    };

    private readonly getDemandedChars = (): string => {
        const rulesWithForbiddenChars = this.policy.rules.filter(
            (rule) => rule instanceof CharRule && (rule.config.max === undefined || rule.config.max !== 0),
        ) as CharRule[];

        return rulesWithForbiddenChars.map((rule) => rule.config.chars).join("");
    };

    private readonly getDemandedCharPools = (): CharPool[] => {
        const rulesWithDemandedCharPools = this.policy.rules.filter(
            (rule) => rule instanceof CharPoolRule && (rule.config.max === undefined || rule.config.min),
        ) as CharPoolRule[];

        return rulesWithDemandedCharPools.map((rule) => rule.config.charPools).flat();
    };

    private static readonly filterWordlist = (
        wordlist: string[],
        forbiddenChars: string,
        demandedChars: string,
        blocklist: string[],
    ): string[] => {
        let filteredList = wordlist;

        filteredList = Generator.removeForbiddenCharsFromWordlist(filteredList, forbiddenChars);
        filteredList = Generator.leaveOnlyDemandedCharsInWordlist(filteredList, demandedChars);
        filteredList = Generator.removeBlocklistedWordsFromWordlist(filteredList, blocklist);

        return filteredList;
    };

    private static readonly removeForbiddenCharsFromWordlist = (
        wordlist: string[],
        forbiddenChars: string,
    ): string[] => {
        const forbiddenLetters = forbiddenChars.replace(matchEveryCharThatIsNotALetter, "");

        if (forbiddenLetters.length === 0) {
            return wordlist;
        }

        return wordlist.filter((word) => !Array.from(forbiddenLetters).some((letter) => word.includes(letter)));
    };

    private static readonly leaveOnlyDemandedCharsInWordlist = (
        wordlist: string[],
        demandedChars: string,
    ): string[] => {
        const demandedLetters = demandedChars.replace(matchEveryCharThatIsNotALetter, "");

        if (demandedLetters.length === 0) {
            return wordlist;
        }

        return wordlist.filter((word) => Array.from(demandedLetters).some((letter) => word.includes(letter)));
    };

    private static readonly removeBlocklistedWordsFromWordlist = (
        wordlist: string[],
        blocklist: string[],
    ): string[] => {
        if (blocklist.length === 0) {
            return wordlist;
        }

        return wordlist.filter((word) => blocklist.every((blocklistedWord) => !word.includes(blocklistedWord)));
    };

    private readonly getPassphraseOptionsFromPolicy = (): Partial<PassphraseOptions> => {
        const length = this.getMinLength();
        const demandedCharPools = this.getDemandedCharPools();
        const forbiddenCharPools = this.getForbiddenCharPools();
        const demandedChars = this.getDemandedChars();

        const demandedCharsWithoutLetters = demandedChars.replace(matchEveryCharThatIsALetter, "");

        const options: Partial<PassphraseOptions> = {
            desiredNumberOfWords: Math.ceil(length / 6), // average word has length of 6. Passphrases exist, to be memorable. So we should avoid unnecessary length.
            containSpecial: demandedCharPools.some((e: CharPool) => e === "special"),
            containNumber: demandedCharPools.some((e: CharPool) => e === "numbers"),
            useTitleCase: demandedCharPools.some((e: CharPool) => e === "uppercase"),
            demandedChars: demandedCharsWithoutLetters,
        };

        if (forbiddenCharPools.some((e: CharPool) => e === "special")) {
            options.separator = "";
        }

        return options;
    };

    private static readonly buildPassphrase = (wordlist: string[], options: Partial<PassphraseOptions>): string => {
        const {
            desiredNumberOfWords = 3,
            separator = "-",
            useTitleCase = false,
            containNumber = false,
            containSpecial = false,
            demandedChars,
        } = options;

        let words = Array.from({ length: desiredNumberOfWords }, () => pickCryptographicallyRandomElement(wordlist));

        if (useTitleCase) {
            words = words.map(toTitleCase);
        }

        if (containNumber) {
            words[getCryptographicallyRandomIndex(words)] += pickCryptographicallyRandomElement([
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
            ]).toString();
        }

        if (containSpecial) {
            const special = "!#$%&*+:;<=>?@^|~".split("");

            if (special.includes(separator)) {
                special.splice(special.indexOf(separator), 1);
            }

            words[getCryptographicallyRandomIndex(words)] += pickCryptographicallyRandomElement(special);
        }

        if (demandedChars) {
            for (const char of demandedChars) {
                words[getCryptographicallyRandomIndex(words)] += char;
            }
        }

        return words.join(separator);
    };

    private async generate(gen: () => string | Promise<string>): Promise<string> {
        const rejectedPassphrases: string[] = [];
        const startTime = Date.now();

        // we use 'while' instead of 'for' because we definitely need to throw
        // the error after last retry
        /* eslint-disable-next-line */
        while (true) {
            const passphrase = await gen();
            const policyValidationResult = this.policy.validate(passphrase);

            if (policyValidationResult.isValid) {
                return passphrase;
            }

            rejectedPassphrases.push(passphrase);

            if (Date.now() - startTime >= this.options.timeout * 1000) {
                throw new PasswordGenerationError(this.policy, this.options.timeout, rejectedPassphrases);
            }
        }
    }
}
