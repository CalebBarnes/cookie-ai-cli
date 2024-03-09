const path = require("node:path");

const project = path.resolve(__dirname, "tsconfig.json");

module.exports = {
  ignorePatterns: ["node_modules/", "dist/", "__tests__/", "__mocks__/"],
  extends: [
    "plugin:require-extensions/recommended",
    ...[
      "@vercel/style-guide/eslint/node",
      "@vercel/style-guide/eslint/typescript",
    ].map(require.resolve),
  ],
  plugins: ["require-extensions"],
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
    "tsdoc/syntax": "off",
  },
};
