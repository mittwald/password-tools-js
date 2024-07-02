import VError from "verror";
import type { Policy } from "./policy/Policy.js";

export class PolicyNotFoundError extends VError {
    public constructor(policy: string, cause?: Error) {
        super(
            {
                name: "PolicyNotFoundError",
                info: {
                    policy,
                },
                cause,
            },
            `Policy "${policy}" not found`,
        );
    }
}

export class FileNotFoundError extends VError {
    public constructor(filename: string, cause?: Error) {
        super(
            {
                name: "FileNotFoundError",
                info: {
                    filename,
                },
                cause,
            },
            `File "${filename}" not found`,
        );
    }
}

export class PasswordGenerationError extends VError {
    public constructor(policy: Policy, timeout: number, rejectedPasswords?: string[]) {
        super(
            {
                name: "PasswordGenerationError",
                info: {
                    policy: JSON.stringify(policy),
                    timeout,
                    triedPasswords: rejectedPasswords,
                },
            },
            "Exceeded timeout while trying to generate a password. Does the policy contradict itself?",
        );
    }
}

export class CryptographicInsecurityError extends VError {
    public constructor() {
        super(
            { name: "CryptographicInsecurityError" },
            "No cryptographically secure generator available, abort password-generation",
        );
    }
}
