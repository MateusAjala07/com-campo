import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  { ignores: ["dist", "build", ".expo", "node_modules"] },
  js.configs.recommended,
  prettierConfig,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2021,
        __DEV__: true, // usado frequentemente no React Native
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      prettier,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      "prettier/prettier": "warn",

      // ⚙️ Corrige falsos positivos de JSX não usado
      "no-unused-vars": ["warn", { varsIgnorePattern: "^[A-Z_]" }],
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",

      // 🔄 Garante bom uso dos hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // 🚀 Hot reload seguro
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],

      // 💅 Opcional: melhora legibilidade
      "no-mixed-spaces-and-tabs": "error",
      "no-empty": "warn",
      "no-console": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
