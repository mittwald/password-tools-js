import { RuleValidationResult, AnyRuleDeclaration, Rule } from "../rule/Rule.js";
import { AsyncRule, SyncRule } from "../rule/Rule.js";
import { ValidatePolicyDeclaration } from "./validateSchema";
import { PolicyValidationProcess } from "./validationProcess/PolicyValidationProcess.js";
import { ruleFactory } from "../rule/factory.js";
import { parse as parseYamlString } from "yaml";
import { PolicyParseError } from "../errors";
import { ComplexityScore, PolicyDeclaration } from "./types";

export type PolicyYamlDeclaration = string;

export type PolicyGenericDeclaration = PolicyYamlDeclaration | PolicyDeclaration | Policy;

export interface PolicyValidationResult {
    isValid: boolean | Promise<boolean>;
    ruleResults: Array<RuleValidationResult | Promise<RuleValidationResult>>;
    complexity: {
        min: ComplexityScore;
        actual: ComplexityScore;
        warning: string | null;
    };
}

export class Policy {
    public readonly rules;
    public readonly minComplexity: ComplexityScore;

    public constructor(rules: Rule[], minComplexity: ComplexityScore = 0) {
        this.rules = rules;
        this.minComplexity = minComplexity;
    }

    public toTransferable(): { minComplexity: ComplexityScore; rules: AnyRuleDeclaration[] } {
        return {
            minComplexity: this.minComplexity,
            rules: this.rules.map((r) => r.toTransferable()),
        };
    }

    public static fromDeclaration(declaration?: PolicyGenericDeclaration): Policy {
        if (typeof declaration === "string") {
            declaration = parseYamlString(declaration) as PolicyDeclaration;
        } else if (declaration instanceof Policy) {
            return declaration;
        }

        if (Policy.assertValidDeclaration(declaration)) {
            return new Policy(declaration.rules.map(ruleFactory), declaration.minComplexity);
        }

        throw new PolicyParseError();
    }

    public async validate(pw: string): Promise<PolicyValidationResult> {
        const syncRules = this.rules.filter((rule) => rule instanceof SyncRule);
        const asyncRules = this.rules.filter((rule) => rule instanceof AsyncRule);

        const validationProcess = new PolicyValidationProcess(pw, this.minComplexity);
        validationProcess.validateRules(syncRules);

        if (validationProcess.allRulesAreSatisfied()) {
            validationProcess.validateRules(asyncRules);
        }

        return validationProcess.getResult();
    }

    public static assertValidDeclaration(data?: PolicyDeclaration): data is PolicyDeclaration {
        if (!data) {
            throw new Error("missing policy data");
        }

        const validate = ValidatePolicyDeclaration;
        validate(data);
        if (validate.errors) {
            const errorMessages = validate.errors.map((error: Error) => error.message);
            throw new Error(errorMessages.toString());
        }

        return true;
    }
}
