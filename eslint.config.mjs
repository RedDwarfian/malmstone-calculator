import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import esLintConfigPrettier from "eslint-config-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: [
      ".angular/*",
      ".github/*",
      ".vscode/*",
      "dist/*",
      "node_modules/*",
    ],
  },
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { files: ["**/*.js"], languageOptions: { sourceType: "script" } },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  esLintConfigPrettier,
];
