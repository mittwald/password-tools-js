import type { RuleValidationResult, Rule } from "../rule/Rule.js";
import { AsyncRule, SyncRule } from "../rule/Rule.js";
import { ComplexityScore, PolicyGenericDeclaration, PolicyDeclaration } from "./declaration.js";
import Ajv from "ajv";
import { PolicyValidationProcess } from "./validationProcess/PolicyValidationProcess.js";
import { ruleFactory } from "../rule/factory.js";
import referenceSchema from "./schema.json";
import { parse as parseYamlString } from "yaml";
import { PolicyParseError } from "../errors";

export * from "./declaration.js";

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
    public readonly rules: Rule[];
    public readonly minComplexity: ComplexityScore;

    public constructor(rules: Rule[], minComplexity: ComplexityScore = 0) {
        this.rules = rules;
        this.minComplexity = minComplexity;
    }

    public static fromData(declaration: PolicyGenericDeclaration): Policy {
        if (typeof declaration === "string") {
            declaration = parseYamlString(declaration) as PolicyDeclaration satisfies PolicyDeclaration;
        } else if (declaration instanceof Policy) {
            return declaration;
        }

        if (Policy.assertValidDeclaration(declaration)) {
            const rules = declaration.rules.map(ruleFactory);
            return new Policy(rules, declaration.minComplexity);
        }

        throw new PolicyParseError();
    }

    public validate(pw: string): PolicyValidationResult {
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

        const validate = new Ajv().compile(referenceSchema);

        validate(data);
        if (validate.errors) {
            const errorMessages = validate.errors.map((error) => error.message);
            throw new Error(errorMessages.toString());
        }

        return true;
    }
}
