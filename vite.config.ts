import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import nodeExternals from "rollup-plugin-node-externals";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { resolve } from "path";

export default defineConfig(({ mode }) => {
    if (mode === "production" || mode === "development") {
        return {
            plugins: [
                nodePolyfills(),
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
                    entry: [
                        resolve(__dirname, "src/index.ts"),
                        resolve(__dirname, "src/policy/Policy.ts"),
                        resolve(__dirname, "src/policy/loader/Loader.ts"),
                        resolve(__dirname, "src/generator/Generator.ts"),
                        resolve(__dirname, "src/rule/Rule.ts"),
                    ],
                    formats: ["es"],
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
    }

    return {
        plugins: [nodeExternals()],
        build: {
            outDir: "./dist/bin",
            lib: {
                entry: resolve(__dirname, "src/cli/cli.ts"),
                formats: ["es"],
                fileName: "cli",
            },
            target: "node21",
        },
    };
});
