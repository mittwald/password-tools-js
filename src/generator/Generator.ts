import { wordList } from "./assets/wordlist";
import { Policy, PolicyGenericDeclaration } from "../policy/Policy";
import {
  CryptographicInsecurityError,
  PasswordGenerationError,
} from "../errors";
import type { CharPool } from "../rule/charpool/CharPoolRule";
import { CharPoolRule } from "../rule/charpool/CharPoolRule";
import {
  getRandomArrayIndex,
  getRandomArrayItem,
  getRandomNumber,
} from "./utils/randomNumber";
import {
  matchEveryCharThatIsALetter,
  matchEveryCharThatIsNotALetter,
} from "./utils/regExps";
import { BlocklistRule } from "../rule/blocklist/BlocklistRule";
import { CharRule } from "../rule/char/CharRule";
import { LengthRule } from "../rule/length/LengthRule";
import { toSentenceCase } from "./utils/toSentenceCase";
import { randomString } from "./utils/randomString";
import { isCryptographicSecureRandom } from "../util/crypto";
import { createPromiseResolver } from "../util/promise";

export interface PassphraseOptions {
  desiredNumberOfWords: number;
  separator: string;
  useTitleCase: boolean;
  containNumber: boolean;
  containSpecial: boolean;
  demandedChars: string;
}

export interface GeneratorOptions {
  /**
   * Timeout in milliseconds to throw an error when no password could be
   * generated in time
   */
  timeout: number;
}

export class Generator {
  private readonly policy: Policy;
  private readonly options: GeneratorOptions;

  private static readonly fallbackLength = {
    default: 16,
    complex: 20,
  };

  public constructor(
    policyData?: PolicyGenericDeclaration,
    options?: GeneratorOptions,
  ) {
    Generator.requireCryptographicSecureRandom();

    this.policy = Policy.fromDeclaration(policyData);
    this.options = options ?? {
      timeout: 15,
    };
  }

  private static requireCryptographicSecureRandom(): void {
    if (!isCryptographicSecureRandom) {
      throw new CryptographicInsecurityError();
    }
  }

  public static generateAnyPassword(): Promise<string> {
    Generator.requireCryptographicSecureRandom();

    return randomString(Generator.fallbackLength.default, "*");
  }

  public async generatePassword(): Promise<string> {
    return new Promise((resolve, reject) => {
      const { pattern, chars, exclude } =
        this.translatePolicyRestrictionsForPasswordGeneration();
      const length = this.getMinLength();

      this.generate(async () =>
        randomString(length, pattern, { chars, exclude: [exclude] }),
      )
        .then((password) => resolve(password))
        .catch((e) => {
          reject(e);
        });
    });
  }

  private readonly getMinLength = (): number => {
    const min = this.getLongestMinLength();
    const max = this.getShortestMaxLength();

    const fallback =
      this.policy.minComplexity <= 3
        ? Generator.fallbackLength.default
        : Generator.fallbackLength.complex;

    if (max && fallback > max) {
      return max;
    }
    if (min && min < fallback) {
      return fallback;
    }

    return min || fallback;
  };

  private readonly getLongestMinLength = (): number | undefined => {
    const policiesWithMinRules = this.policy.rules.filter(
      (rule): rule is LengthRule =>
        !!(rule instanceof LengthRule && rule.config.min),
    );

    if (policiesWithMinRules.length === 0) {
      return undefined;
    }

    return Math.max(...policiesWithMinRules.map((r) => r.config.min!));
  };

  private readonly getShortestMaxLength = (): number | undefined => {
    const policiesWithMaxRules = this.policy.rules.filter(
      (rule): rule is LengthRule =>
        !!(rule instanceof LengthRule && rule.config.max),
    );

    if (policiesWithMaxRules.length === 0) {
      return undefined;
    }

    return Math.min(...policiesWithMaxRules.map((r) => r.config.max!));
  };

  private readonly translatePolicyRestrictionsForPasswordGeneration = (): {
    pattern: string;
    chars: string;
    exclude: string;
  } => {
    const pattern = this.removeForbiddenCharPoolsFromPattern(
      "aA0!?",
      this.getForbiddenCharPools(),
    );
    const chars = this.getDemandedChars();
    const exclude = this.getForbiddenChars();

    return { pattern, chars, exclude };
  };

  private readonly getForbiddenCharPools = (): CharPool[] => {
    const rulesWithForbiddenCharPools = this.policy.rules.filter(
      (rule): rule is CharPoolRule =>
        rule instanceof CharPoolRule && rule.config.max === 0,
    );

    return rulesWithForbiddenCharPools
      .map((rule) => rule.config.charPools)
      .flat();
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
      (rule): rule is CharRule =>
        rule instanceof CharRule && rule.config.max === 0,
    );

    return rulesWithForbiddenCharPools
      .map((rule) => rule.config.chars)
      .join("");
  };

  public static generateAnyPassphrase(): Promise<string> {
    Generator.requireCryptographicSecureRandom();

    return this.buildPassphrase(wordList, {});
  }

  public async generatePassphrase(): Promise<string> {
    return new Promise((resolve, reject) => {
      const { options, filteredWordlist } =
        this.translatePolicyRestrictionsForPassphraseGeneration();

      this.generate(() => Generator.buildPassphrase(filteredWordlist, options))
        .then((password) => resolve(password))
        .catch((e) => {
          reject(e);
        });
    });
  }

  private readonly translatePolicyRestrictionsForPassphraseGeneration = (): {
    options: Partial<PassphraseOptions>;
    filteredWordlist: string[];
  } => {
    const forbiddenChars = this.getForbiddenChars();
    const blocklist = this.getBlocklistedWords();
    const demandedChars = this.getDemandedChars();

    const filteredWordlist = Generator.filterWordlist(
      wordList,
      forbiddenChars,
      demandedChars,
      blocklist,
    );
    const options = this.getPassphraseOptionsFromPolicy();

    return { options, filteredWordlist };
  };

  private readonly getBlocklistedWords = (): string[] => {
    const blocklistRules = this.policy.rules.filter(
      (rule): rule is BlocklistRule => rule instanceof BlocklistRule,
    );
    return blocklistRules.flatMap((rule) => rule.config.blocklist);
  };

  private readonly getDemandedChars = (): string => {
    const rulesWithForbiddenChars = this.policy.rules.filter(
      (rule): rule is CharRule =>
        rule instanceof CharRule &&
        (rule.config.max === undefined || rule.config.max !== 0),
    );

    return rulesWithForbiddenChars.map((rule) => rule.config.chars).join("");
  };

  private readonly getDemandedCharPools = (): CharPool[] => {
    const rulesWithDemandedCharPools = this.policy.rules.filter(
      (rule): rule is CharPoolRule =>
        !!(
          rule instanceof CharPoolRule &&
          (rule.config.max === undefined || rule.config.min)
        ),
    );

    return rulesWithDemandedCharPools
      .map((rule) => rule.config.charPools)
      .flat();
  };

  private static readonly filterWordlist = (
    wordlist: string[],
    forbiddenChars: string,
    demandedChars: string,
    blocklist: string[],
  ): string[] => {
    let filteredList = wordlist;

    filteredList = Generator.removeForbiddenCharsFromWordlist(
      filteredList,
      forbiddenChars,
    );
    filteredList = Generator.leaveOnlyDemandedCharsInWordlist(
      filteredList,
      demandedChars,
    );
    filteredList = Generator.removeBlocklistedWordsFromWordlist(
      filteredList,
      blocklist,
    );

    return filteredList;
  };

  private static readonly removeForbiddenCharsFromWordlist = (
    wordlist: string[],
    forbiddenChars: string,
  ): string[] => {
    const forbiddenLetters = forbiddenChars.replace(
      matchEveryCharThatIsNotALetter,
      "",
    );

    if (forbiddenLetters.length === 0) {
      return wordlist;
    }

    return wordlist.filter(
      (word) =>
        !Array.from(forbiddenLetters).some((letter) => word.includes(letter)),
    );
  };

  private static readonly leaveOnlyDemandedCharsInWordlist = (
    wordlist: string[],
    demandedChars: string,
  ): string[] => {
    const demandedLetters = demandedChars.replace(
      matchEveryCharThatIsNotALetter,
      "",
    );

    if (demandedLetters.length === 0) {
      return wordlist;
    }

    return wordlist.filter((word) =>
      Array.from(demandedLetters).some((letter) => word.includes(letter)),
    );
  };

  private static readonly removeBlocklistedWordsFromWordlist = (
    wordlist: string[],
    blocklist: string[],
  ): string[] => {
    if (blocklist.length === 0) {
      return wordlist;
    }

    return wordlist.filter((word) =>
      blocklist.every((blocklistedWord) => !word.includes(blocklistedWord)),
    );
  };

  private readonly getPassphraseOptionsFromPolicy =
    (): Partial<PassphraseOptions> => {
      const length = this.getMinLength();
      const demandedCharPools = this.getDemandedCharPools();
      const forbiddenCharPools = this.getForbiddenCharPools();
      const demandedChars = this.getDemandedChars();

      const demandedCharsWithoutLetters = demandedChars.replace(
        matchEveryCharThatIsALetter,
        "",
      );

      const options: Partial<PassphraseOptions> = {
        desiredNumberOfWords: Math.ceil(length / 6), // average word has length of 6. Passphrases exist, to be memorable. So we should avoid unnecessary length.
        containSpecial: demandedCharPools.some(
          (e: CharPool) => e === "special",
        ),
        containNumber: demandedCharPools.some((e: CharPool) => e === "numbers"),
        useTitleCase: demandedCharPools.some(
          (e: CharPool) => e === "uppercase",
        ),
        demandedChars: demandedCharsWithoutLetters,
      };

      if (forbiddenCharPools.some((e: CharPool) => e === "special")) {
        options.separator = "";
      }

      return options;
    };

  private static readonly buildPassphrase = (
    wordlist: string[],
    options: Partial<PassphraseOptions>,
  ): Promise<string> => {
    return new Promise((resolve) => {
      const {
        desiredNumberOfWords = 3,
        separator = "-",
        useTitleCase = false,
        containNumber = false,
        containSpecial = false,
        demandedChars,
      } = options;

      let words = Array.from({ length: desiredNumberOfWords }, () =>
        getRandomArrayItem(wordlist),
      );

      if (useTitleCase) {
        words = words.map(toSentenceCase);
      }

      if (containNumber) {
        words[getRandomArrayIndex(words)] += getRandomNumber(0, 9).toString();
      }

      if (containSpecial) {
        const special = "!#$%&*+:;<=>?@^|~".split("");

        if (special.includes(separator)) {
          special.splice(special.indexOf(separator), 1);
        }

        words[getRandomArrayIndex(words)] += getRandomArrayItem(special);
      }

      if (demandedChars) {
        for (const char of demandedChars) {
          words[getRandomArrayIndex(words)] += char;
        }
      }

      resolve(words.join(separator));
    });
  };

  private async generate(
    requestRandomString: () => Promise<string>,
  ): Promise<string> {
    const startTime = Date.now();
    const { reject, resolve, promise } = createPromiseResolver<string>();

    const rejectedStrings: string[] = [];

    const requestGenerate = async (): Promise<void> => {
      const password = await requestRandomString();
      const policyValidationResult = await this.policy.validate(password);

      if (policyValidationResult.isValid) {
        resolve(password);
        return;
      }

      rejectedStrings.push(password);
      if (Date.now() - startTime >= this.options.timeout * 1000) {
        reject(
          new PasswordGenerationError(
            this.policy,
            this.options.timeout,
            rejectedStrings,
          ),
        );
      } else {
        await requestGenerate();
      }
    };

    await requestGenerate();

    return promise;
  }
}
