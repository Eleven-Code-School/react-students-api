// eslint.config.js (Flat Config, sin extends legacy)
import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import unusedImports from "eslint-plugin-unused-imports";
import { defineConfig } from "eslint/config";
import globals from "globals";

export default defineConfig([
    { ignores: ["dist", "build", "node_modules"] },
    {
        ...js.configs.recommended,
    },
    {
        files: ["**/*.{js,jsx}"],
        plugins: {
            react,
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
            "unused-imports": unusedImports,
        },
        settings: {
            react: { version: "detect" },
        },
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: globals.browser,
            parserOptions: { ecmaFeatures: { jsx: true } },
        },
        rules: {
            "no-unused-vars": "off",
            "unused-imports/no-unused-imports": "error",
            "react/react-in-jsx-scope": "off",
            "react/jsx-uses-vars": "error",
            "react/jsx-no-undef": ["error", { allowGlobals: true }],
            "no-undef": "error",
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",
        },
    },
]);
