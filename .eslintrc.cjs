const path = require("node:path");

const project = path.resolve(__dirname, "tsconfig.json");

module.exports = {
  ignorePatterns: ["node_modules/", "dist/", "__tests__/", "__mocks__/"],
  extends: [
    "@vercel/style-guide/eslint/node",
    "@vercel/style-guide/eslint/typescript",
  ].map(require.resolve),

  parserOptions: {
    project,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },

  rules: {
    "@typescript-eslint/no-empty-function": "off",
    "no-console": "off",
    "tsdoc/syntax": "off",
    "import/order": [
      "warn",
      {
        groups: [
          "builtin", // Node.js built-in modules
          "external", // Packages
          "parent", // Relative parent
          "sibling", // Relative sibling
          "index", // Relative index
        ],
        "newlines-between": "never",
        distinctGroup: false,
      },
    ],
  },
};
