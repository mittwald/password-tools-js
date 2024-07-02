import axios from "axios";
import sha1 from "../../../util/sha1.js";
import type { AxiosInstance } from "axios";

export class HaveIBeenPwnedClient {
    private readonly hibpAxios: AxiosInstance;
    public constructor() {
        this.hibpAxios = axios.create({
            baseURL: "https://api.pwnedpasswords.com",
        });
    }

    public async isPasswordLeaked(password: string): Promise<boolean> {
        const hash = sha1.hex(password).toString();
        const hashPrefix = hash.slice(0, 5);
        const hashSuffix = hash.slice(5);

        const response = await this.hibpAxios.get<string>(`/range/${hashPrefix}`);
        const leakedSuffixes = response.data.split("\n");

        for (const leakedSuffix of leakedSuffixes) {
            if (leakedSuffix.startsWith(hashSuffix.toUpperCase())) {
                return true;
            }
        }

        return false;
    }
}
