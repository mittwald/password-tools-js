import type { RuleValidationResult, Rule } from "../rule/Rule.js";
import { AsyncRule, SyncRule } from "../rule/Rule.js";
import type { ComplexityScore, PolicyDeclaration } from "./declaration.js";
import Ajv from "ajv";
import { PolicyValidationProcess } from "./validationProcess/PolicyValidationProcess.js";
import { ruleFactory } from "../rule/factory.js";
import { RemotePolicyLoader } from "./loader/Loader.js";
import referenceSchema from "./schema.json";

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

    public static fromDeclaration(decl: PolicyDeclaration): Policy {
        const rules = decl.rules.map(ruleFactory);
        return new Policy(rules, decl.minComplexity);
    }

    public static async fromDeclarationRemote(url: string, filepath: string): Promise<Policy> {
        const policyDeclaration = await new RemotePolicyLoader(url).loadPolicy(filepath);
        return this.fromDeclaration(policyDeclaration);
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

    public static assertValidDeclaration(policy: PolicyDeclaration): void {
        const validate = new Ajv().compile(referenceSchema);
        validate(policy);

        if (validate.errors) {
            const errorMessages = validate.errors.map((error) => error.message);

            throw new Error(errorMessages.toString());
        }
    }
}
