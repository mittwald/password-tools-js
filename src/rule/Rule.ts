import { AnyRuleResult, RuleDeclaration } from "./declaration.js";
import type { OneOfRuleType } from "./declaration.js";

export * from "./declaration";

export type RuleValidationResult<TContext extends Record<string, unknown> = AnyRuleResult> = TContext & {
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

    public toTransferable(): RuleDeclaration<TRuleType, TConfig> {
        return {
            ruleType: this.ruleType,
            ...this.config,
        };
    }
}

export abstract class SyncRule<
    TRuleType extends OneOfRuleType,
    TConfig extends Record<string, unknown> = Record<string, unknown>,
    TResultContext extends Record<string, unknown> = Record<string, unknown>,
> extends BaseRule<TRuleType, TConfig> {
    public abstract validate(pw: string): RuleValidationResult<TResultContext>;
}

export abstract class AsyncRule<
    TRuleType extends OneOfRuleType,
    TConfig extends Record<string, unknown> = Record<string, unknown>,
    TResultContext extends Record<string, unknown> = Record<string, unknown>,
> extends BaseRule<TRuleType, TConfig> {
    public abstract validate(pw: string): Promise<RuleValidationResult<TResultContext>>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Rule<TRuleType extends OneOfRuleType = any> = SyncRule<TRuleType> | AsyncRule<TRuleType>;
