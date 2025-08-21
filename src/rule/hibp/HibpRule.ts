import { BaseRuleIdentifier, RuleValidationResult } from "../Rule.js";
import { AsyncRule } from "../Rule.js";
import type { HibpConfig } from "./declaration.js";
import { RuleType } from "../declaration.js";
import axios, { AxiosInstance } from "axios";

export type ResultContext = {
  ruleType: typeof RuleType.hibp;
};

export type HibpResult = ResultContext & HibpConfig;

export class HibpRule extends AsyncRule<
  typeof RuleType.hibp,
  HibpConfig,
  ResultContext
> {
  ruleType = RuleType.hibp;

  private client: AxiosInstance;

  public constructor(config: BaseRuleIdentifier<HibpConfig>) {
    super(config);
    this.client = axios.create();
  }

  private async generateSha1Hex(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-1", data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  private async isPasswordLeaked(password: string): Promise<boolean> {
    const hash = await this.generateSha1Hex(password);
    const hashPrefix = hash.slice(0, 5);
    const hashSuffix = hash.slice(5);

    const baseUrl =
      this.config.endpointUrl ??
      "https://api.pwnedpasswords.com/range/{hashPrefix}";

    try {
      const response = await this.client.get<string>(
        baseUrl.replace("{hashPrefix}", hashPrefix),
      );
      const leakedSuffixes = response.data.split("\n");

      for (const leakedSuffix of leakedSuffixes) {
        if (leakedSuffix.startsWith(hashSuffix.toUpperCase())) {
          return true;
        }
      }
    } catch (ignoredError) {
      return !this.config.willSucceedOnError;
    }

    return false;
  }

  public async validate(
    password: string,
  ): Promise<RuleValidationResult<HibpResult>> {
    return {
      isValid: !(await this.isPasswordLeaked(password)),
      ruleType: this.ruleType,
      ...this.config,
    };
  }
}
