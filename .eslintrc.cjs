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
    // "import/extensions": ["error", "always", { ts: "never", tsx: "never" }],
    "tsdoc/syntax": "off",
  },
};
