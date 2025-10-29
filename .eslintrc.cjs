module.exports = {
  root: true,
  ignorePatterns: [
    "**/node_modules/**",
    "**/.next/**",
    "**/dist/**",
    "**/build/**",
    "**/coverage/**",
    "howdy-mcp/**",
  ],
  overrides: [
    {
      files: ["frontend/**/*.{ts,tsx}"],
      env: {
        browser: true,
        es2021: true,
      },
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        sourceType: "module",
      },
      plugins: ["@typescript-eslint", "react", "react-hooks", "jsx-a11y"],
      extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:jsx-a11y/recommended",
        "prettier",
      ],
      rules: {
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-unused-vars": [
          "warn",
          {
            argsIgnorePattern: "^_",
            varsIgnorePattern: "^_",
          },
        ],
        "@typescript-eslint/no-explicit-any": "off",
        "react/react-in-jsx-scope": "off",
        "react/prop-types": "off",
        "react/no-unescaped-entities": "off",
        "jsx-a11y/heading-has-content": "off",
        "jsx-a11y/click-events-have-key-events": "off",
        "jsx-a11y/no-static-element-interactions": "off",
        "jsx-a11y/interactive-supports-focus": "off",
      },
      settings: {
        react: {
          version: "detect",
        },
      },
    },
    {
      files: ["backend/**/*.js"],
      env: {
        node: true,
        es2021: true,
      },
      extends: ["eslint:recommended", "prettier"],
      rules: {
        "no-console": "off",
        "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      },
    },
    {
      files: ["*.cjs", "*.js"],
      env: {
        node: true,
        es2021: true,
      },
      extends: ["eslint:recommended"],
    },
    {
      files: ["**/*.mjs"],
      env: {
        node: true,
        es2021: true,
      },
      parserOptions: {
        sourceType: "module",
      },
      extends: ["eslint:recommended"],
    },
  ],
}
