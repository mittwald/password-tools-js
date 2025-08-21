import { RuleValidationResult, Rule } from "../rule/Rule.js";
import { AsyncRule, SyncRule } from "../rule/Rule.js";
import { ValidatePolicyDeclaration } from "./validateSchema";
import { PolicyValidationProcess } from "./validationProcess/PolicyValidationProcess.js";
import { ruleFactory } from "../rule/factory.js";
import { parse as parseYamlString } from "yaml";
import { PolicyParseError } from "../errors";
import { ComplexityScore, PolicyDeclaration } from "./types";

export type { ComplexityScore, PolicyDeclaration } from "./types";
export type PolicyYamlDeclaration = string;
export type PolicyGenericDeclaration =
  | PolicyYamlDeclaration
  | PolicyDeclaration
  | Policy;

export interface PolicyValidationResult {
  isValid: boolean | Promise<boolean>;
  ruleResults: Array<RuleValidationResult | Promise<RuleValidationResult>>;
  complexity: {
    min: ComplexityScore;
    actual: ComplexityScore;
    warning: string | null;
  };
}

export const IS_POLICY_SYMBOL = Symbol.for("password.tools.js.class.policy");

export class Policy {
  public readonly [IS_POLICY_SYMBOL] = true;

  public readonly rules;
  public readonly minComplexity: ComplexityScore;

  public constructor(rules: Rule[], minComplexity: ComplexityScore = 0) {
    this.rules = rules;
    this.minComplexity = minComplexity;
  }

  static isPolicy(data: unknown): data is Policy {
    return (
      data instanceof Policy ||
      (data !== null &&
        typeof data === "object" &&
        (data as { [key: symbol]: undefined })[IS_POLICY_SYMBOL] === true)
    );
  }

  public toDeclaration(): PolicyDeclaration {
    return {
      minComplexity: this.minComplexity,
      rules: this.rules.map((r) => r.toDeclaration()),
    };
  }

  public static fromDeclaration(
    declaration?: PolicyGenericDeclaration,
  ): Policy {
    if (typeof declaration === "string") {
      declaration = parseYamlString(declaration) as PolicyDeclaration;
    } else if (Policy.isPolicy(declaration)) {
      return declaration;
    }

    if (Policy.assertValidDeclaration(declaration)) {
      return new Policy(
        declaration.rules.map(ruleFactory),
        declaration.minComplexity,
      );
    }

    throw new PolicyParseError();
  }

  public async validate(pw: string): Promise<PolicyValidationResult> {
    const syncRules = this.rules.filter((rule) => rule instanceof SyncRule);
    const asyncRules = this.rules.filter((rule) => rule instanceof AsyncRule);

    const validationProcess = new PolicyValidationProcess(
      pw,
      this.minComplexity,
    );
    validationProcess.validateRules(syncRules);

    if (validationProcess.allRulesAreSatisfied()) {
      validationProcess.validateRules(asyncRules);
    }

    return validationProcess.getResult();
  }

  public static assertValidDeclaration(
    data?: unknown,
  ): data is PolicyDeclaration {
    if (!data) {
      throw new Error("missing policy data");
    }

    const validate = ValidatePolicyDeclaration;
    validate(data);
    if (validate.errors) {
      const errorMessages = validate.errors.map(
        (error: Error) => error.message,
      );
      throw new Error(errorMessages.toString());
    }

    return true;
  }
}
