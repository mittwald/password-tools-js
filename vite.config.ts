import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig(() => {
    return {
        plugins: [
            dts({
                include: ["src"],
                outDir: "dist/",
                rollupTypes: true,
                copyDtsFiles: true,
            }),
        ],
        build: {
            emptyOutDir: false,
            lib: {
                name: 'password-tools-js',
                entry: [
                    resolve(__dirname, "src/policy/Policy.ts"),
                    resolve(__dirname, "src/generator/Generator.ts"),
                    resolve(__dirname, "src/rule/Rule.ts"),
                ],
                formats: ["es", "cjs"],
            },
            target: "esnext",
            rollupOptions: {
                output: {
                    manualChunks: (id) => {
                        if (id.includes("zxcvbn")) {
                            if (id.includes("@zxcvbn-ts/language-de")) {
                                return "zxcvbn-de";
                            }
                            if (id.includes("@zxcvbn-ts/language-en")) {
                                return "zxcvbn-en";
                            }
                            if (id.includes("@zxcvbn-ts/language-common")) {
                                return "zxcvbn-common";
                            }

                            return `zxcvbn`;
                        }
                        if (id.includes("/ajv/")) {
                            return "ajv";
                        }
                        if (id.endsWith("/wordlist.ts")) {
                            return "wordlist";
                        }
                        if (id.includes("/yaml/")) {
                            return "yaml";
                        }
                    },
                },
            },
        },
    };
});
