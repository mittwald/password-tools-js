import eslint from "@eslint/js";
import tsEsLint, { ConfigArray } from "typescript-eslint";

export default tsEsLint.config(eslint.configs.recommended, tsEsLint.configs.recommended, {
    rules: {
        "@typescript-eslint/no-explicit-any": ["warn"],
        "@typescript-eslint/no-unused-vars": [
            "error",
            {
                varsIgnorePattern: "[iI]gnored",
                argsIgnorePattern: "[iI]gnored",
                caughtErrorsIgnorePattern: "[iI]gnored",
            },
        ],
    },
}) as ConfigArray;
