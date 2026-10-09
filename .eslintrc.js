module.exports = {
  extends: ["@cruk", "next/core-web-vitals"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
  },
  rules: {
    // It's ok to have dev dependencies imported for test files
  },
  settings: {
    // The @cruk config enables eslint-plugin-jest rules; this project uses Playwright, not Jest
    jest: { version: 29 },
  },
  ignorePatterns: ["*.config.js", "node_modules"],
};