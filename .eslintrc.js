module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "airbnb",
    "plugin:react/recommended",
    "plugin:prettier/recommended",
  ],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    createDefaultProgram: true,
  },
  plugins: ["react", "html", "prettier", "react-hooks"],
  rules: {
    "require-jsdoc": "off",
    "import/prefer-default-export": "off",
    "no-param-reassign": "off",
    "no-plusplus": "off",
    "no-shadow": "off",
    "no-unused-vars": "warn",
    "no-unused-expressions": "warn",
    "react/jsx-filename-extension": ["error", { extensions: [".js", ".jsx"] }],
    "react/prop-types": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  ignorePatterns: [".eslintrc.js", ".prettierrc.json"],
};
