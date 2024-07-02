import type { AnyRuleResult } from "./declaration.js";

export * from "./declaration";

export type RuleValidationResult<TContext = AnyRuleResult> = TContext & {
    isValid: boolean;
    failingBoundary?: string;
    identifier?: string;
};

export type BaseRuleIdentifier<T> = T & {
    identifier?: string;
};

abstract class BaseRule<TConfig = Record<string, any>> {
    public readonly config: BaseRuleIdentifier<TConfig>;

    public constructor(config: BaseRuleIdentifier<TConfig>) {
        this.config = config;
    }
}

export abstract class SyncRule<TConfig = any, TResultContext = any> extends BaseRule<TConfig> {
    public abstract validate(pw: string): RuleValidationResult<TResultContext>;
}

export abstract class AsyncRule<TConfig = any, TResultContext = any> extends BaseRule<TConfig> {
    public abstract validate(pw: string): Promise<RuleValidationResult<TResultContext>>;
}

export type Rule = SyncRule | AsyncRule;
