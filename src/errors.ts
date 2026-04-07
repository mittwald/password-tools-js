import type { Policy } from "./policy/Policy.js";

export class PolicyParseError extends Error {
  public constructor(cause?: string) {
    super("Policy could not be parsed", {
      cause,
    });
  }
}
PolicyParseError.prototype.name = "PolicyParseError";

export class PolicyNotFoundError extends Error {
  public readonly policy: string;

  public constructor(policy: string, cause?: Error) {
    super(`Policy "${policy}" not found`, {
      cause,
    });
    this.policy = policy;
  }
}
PolicyNotFoundError.prototype.name = "PolicyNotFoundError";

export class PasswordGenerationError extends Error {
  public readonly policy: string;
  public readonly rejectedPasswords?: string[];
  public readonly timeout: number;

  public constructor(
    policy: Policy,
    timeout: number,
    rejectedPasswords?: string[],
  ) {
    super(
      "Exceeded timeout while trying to generate a password. Does the policy contradict itself?",
    );
    this.policy = JSON.stringify(policy);
    this.timeout = timeout;
    this.rejectedPasswords = rejectedPasswords;
  }
}
PasswordGenerationError.prototype.name = "PasswordGenerationError";

export class CryptographicInsecurityError extends Error {
  public constructor() {
    super(
      "No cryptographically secure generator available, abort password-generation",
    );
  }
}
CryptographicInsecurityError.prototype.name = "CryptographicInsecurityError";
