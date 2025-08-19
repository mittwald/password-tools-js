import { AnyRuleDeclaration } from "./declaration.js";
import { RuleType } from "./declaration.js";
import { LengthRule } from "./length/LengthRule.js";
import { BlocklistRule } from "./blocklist/BlocklistRule.js";
import { HibpRule } from "./hibp/HibpRule.js";
import { SequenceRule } from "./sequence/SequenceRule.js";
import { CharPoolRule } from "./charpool/CharPoolRule.js";
import { CharRule } from "./char/CharRule.js";
import { RegexRule } from "./regex/RegexRule.js";

export const ruleFactory = (declaration: AnyRuleDeclaration) => {
  switch (declaration.ruleType) {
    case RuleType.length:
      return new LengthRule(declaration);
    case RuleType.charPool:
      return new CharPoolRule(declaration);
    case RuleType.char:
      return new CharRule(declaration);
    case RuleType.regex:
      return new RegexRule(declaration);
    case RuleType.blocklist:
      return new BlocklistRule(declaration);
    case RuleType.hibp:
      return new HibpRule(declaration);
    case RuleType.sequence:
      return new SequenceRule(declaration);
  }

  throw new Error(`Error factoring rule ${declaration}`);
};
