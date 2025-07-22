import { defineConfig } from "vite";
import nodeExternals from "rollup-plugin-node-externals";
import { resolve } from "path";

export default defineConfig(({}) => {
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
        },
    };
});
