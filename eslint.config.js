import eslint from "@eslint/js";
import { globalIgnores } from "eslint/config";
import tsEsLint from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default tsEsLint.config(
  globalIgnores(["dist/", "src/**/validateSchema.mjs"]),
  {
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
  },
  eslint.configs.recommended,
  eslintPluginPrettierRecommended,
  ...tsEsLint.configs.recommended,
);
