module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "plugin:react/recommended",
    "airbnb",
    "plugin:prettier/recommended",
  ],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    createDefaultProgram: true,
  },
  plugins: ["react", "html", "prettier"],
  rules: {
    "spaced-comment": "off",
    "require-jsdoc": "off",
    "react/prop-types": "off",
    "react/jsx-props-no-spreading": "off",
    "react/self-closing-comp": "off",
    "react/react-in-jsx-scope": "off",
    "react/jsx-filename-extension": ["warn", { extensions: [".js", ".jsx"] }],
    "no-param-reassign": 0,
    "no-plusplus": "off",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  ignorePatterns: ["!.eslintrc.js", "!.prettierrc.json"],
};
