import type { RuleDeclaration, RuleType } from "../declaration.js";

export enum RegexFlags {
    global = "g",
    multiLine = "m",
    insensitive = "i",
    sticky = "y",
    unicode = "u",
    singleLine = "s",
    indices = "d",
}

export interface RegexConfig {
    pattern: string;
    flags?: RegexFlags[];
    translationKey?: string;
    min?: number;
    max?: number;
}

export type RegexRuleDeclaration = RuleDeclaration<RuleType.regex, RegexConfig>;
