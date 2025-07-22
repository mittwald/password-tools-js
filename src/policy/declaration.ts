import type { AnyRuleDeclaration } from "../rule/declaration.js";
import { Policy } from "./Policy";

export type ComplexityScore = 0 | 1 | 2 | 3 | 4;

export interface PolicyDeclaration {
    rules: AnyRuleDeclaration[];
    minComplexity?: ComplexityScore;
}

export type PolicyGenericDeclaration = string | undefined | PolicyDeclaration | Policy;
