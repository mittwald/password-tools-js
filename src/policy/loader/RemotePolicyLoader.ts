import { PolicyNotFoundError } from "../../errors.js";
import type { PolicyLoader } from "./PolicyLoader.js";
import type { AxiosInstance } from "axios";
import axios from "axios";
import type { PolicyDeclaration } from "../declaration.js";

export class RemotePolicyLoader implements PolicyLoader {
    private readonly axios: AxiosInstance;

    public constructor(baseUrl: string) {
        this.axios = axios.create({ baseURL: baseUrl });
    }

    public async loadPolicy(filePath: string): Promise<PolicyDeclaration> {
        try {
            const response = await this.axios.get<PolicyDeclaration>(filePath);
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 404) {
                throw new PolicyNotFoundError(filePath, error);
            }
            throw error;
        }
    }
}
