import type { AnyRuleDeclaration } from "../rule/declaration.js";

export type ComplexityScore = 0 | 1 | 2 | 3 | 4;

export interface PolicyDeclaration {
    rules: AnyRuleDeclaration[];
    minComplexity?: ComplexityScore;
}
