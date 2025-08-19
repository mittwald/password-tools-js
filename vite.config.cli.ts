import { defineConfig } from "vite";
import nodeExternals from "rollup-plugin-node-externals";
import { resolve } from "path";

export default defineConfig(() => {
    return {
        plugins: [nodeExternals()],
        build: {
            emptyOutDir: true,
            outDir: "./dist",
            lib: {
                entry: resolve(__dirname, "src/cli/cli.ts"),
                formats: ["es"],
                fileName: "cli",
            },
            target: "node21",
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
