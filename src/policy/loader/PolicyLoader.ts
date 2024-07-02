import type { PolicyDeclaration } from "../declaration.js";

export interface PolicyLoader {
    loadPolicy(name: string): Promise<PolicyDeclaration> | PolicyDeclaration;
}
