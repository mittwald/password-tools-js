import { AnyRuleResult, RuleDeclaration } from "./declaration.js";
import type { OneOfRuleType } from "./declaration.js";

export * from "./declaration";

export type RuleValidationResult<
  TContext extends Record<string, unknown> = AnyRuleResult,
> = TContext & {
  isValid: boolean;
  failingBoundary?: string;
  identifier?: string;
};

export type BaseRuleIdentifier<T> = T & {
  identifier?: string;
};

abstract class BaseRule<
  TRuleType extends OneOfRuleType,
  TConfig extends Record<string, unknown> = Record<string, unknown>,
> {
  public readonly config: BaseRuleIdentifier<TConfig>;
  abstract readonly ruleType: TRuleType;

  public constructor(config: BaseRuleIdentifier<TConfig>) {
    this.config = config;
  }

  public toDeclaration(): RuleDeclaration<TRuleType, TConfig> {
    return {
      ruleType: this.ruleType,
      ...this.config,
    };
  }
}

export abstract class Rule<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TRuleType extends OneOfRuleType = any,
  TConfig extends Record<string, unknown> = Record<string, unknown>,
  TResultContext extends Record<string, unknown> = AnyRuleResult,
> extends BaseRule<TRuleType, TConfig> {
  public abstract validate(
    pw: string,
  ): Promise<RuleValidationResult<TResultContext>>;
}
