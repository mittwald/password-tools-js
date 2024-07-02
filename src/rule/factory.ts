import type { RuleDeclaration } from "./declaration.js";
import { RuleType } from "./declaration.js";
import type { SyncRule } from "./Rule.js";
import { LengthRule } from "./length/LengthRule.js";
import { BlocklistRule } from "./blocklist/BlocklistRule.js";
import { HibpRule } from "./hibp/HibpRule.js";
import { SequenceRule } from "./sequence/SequenceRule.js";
import { CharPoolRule } from "./charpool/CharPoolRule.js";
import { CharRule } from "./char/CharRule.js";
import { RegexRule } from "./regex/RegexRule.js";

export const ruleFactory = (decl: RuleDeclaration<RuleType>): SyncRule => {
    switch (decl.ruleType) {
        case RuleType.length:
            return new LengthRule(decl);
        case RuleType.charPool:
            return new CharPoolRule(decl);
        case RuleType.char:
            return new CharRule(decl);
        case RuleType.regex:
            return new RegexRule(decl);
        case RuleType.blocklist:
            return new BlocklistRule(decl);
        case RuleType.hibp:
            return new HibpRule(decl);
        case RuleType.sequence:
            return new SequenceRule(decl);
    }

    throw new Error(`Error factoring rule ${decl.ruleType}`);
};
