import { defineConfig } from "eslint/config";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default defineConfig([
  tseslint.configs.recommended,
  reactHooks.configs.flat["recommended-latest"],
  {
    ...react.configs.flat.recommended,
    ...react.configs.flat["jsx-runtime"],
    settings: {
      react: {
        version: "detect",
      },
    },
    files: ["src/**/*.{ts,tsx,jsx}"],
  },
]);
