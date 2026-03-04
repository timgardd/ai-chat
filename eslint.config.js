import js from "@eslint/js";
import prettier from "eslint-config-prettier";

export default [
  {
    ...js.configs.recommended,
    languageOptions: {
      ...js.configs.recommended.languageOptions,
      globals: {
        ...js.configs.recommended.languageOptions?.globals,
        window: "readonly",
        document: "readonly",
        customElements: "readonly",
        HTMLElement: "readonly",
      },
    },
  },
  prettier,
];
