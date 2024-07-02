import type { LengthRuleDeclaration } from "./length/declaration.js";
import type { HibpRuleDeclaration } from "./hibp/declaration.js";
import type { BlocklistRuleDeclaration } from "./blocklist/declaration.js";
import type { SequenceRuleDeclaration } from "./sequence/declaration.js";
import type { CharRuleDeclaration } from "./char/declaration.js";
import type { CharPoolRuleDeclaration } from "./charpool/declaration.js";
import type { RegexRuleDeclaration } from "./regex/declaration.js";
import type { BlocklistResult } from "./blocklist/BlocklistRule.js";
import type { CharResult } from "./char/CharRule.js";
import type { CharPoolResult } from "./charpool/CharPoolRule.js";
import type { HibpResult } from "./hibp/HibpRule.js";
import type { LengthResult } from "./length/LengthRule.js";
import type { SequenceResult } from "./sequence/SequenceRule.js";
import type { RegexResult } from "./regex/RegexRule.js";

export * from "./blocklist/declaration.js";
export * from "./char/declaration.js";
export * from "./charpool/declaration.js";
export * from "./hibp/declaration.js";
export * from "./length/declaration.js";
export * from "./regex/declaration.js";
export * from "./sequence/declaration.js";

export enum RuleType {
    length = "length",
    charPool = "charPool",
    char = "char",
    regex = "regex",
    blocklist = "blocklist",
    hibp = "hibp",
    sequence = "sequence",
}

export type AnyRuleDeclaration =
    | LengthRuleDeclaration
    | CharPoolRuleDeclaration
    | CharRuleDeclaration
    | RegexRuleDeclaration
    | BlocklistRuleDeclaration
    | HibpRuleDeclaration
    | SequenceRuleDeclaration;

export type AnyRuleResult =
    | BlocklistResult
    | CharResult
    | CharPoolResult
    | HibpResult
    | LengthResult
    | RegexResult
    | SequenceResult;

export type RuleDeclaration<TRuleType extends RuleType, TSpecificConfig = any> = {
    ruleType: TRuleType;
    identifier?: string;
} & TSpecificConfig;

export default {};
