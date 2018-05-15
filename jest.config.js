module.exports = {
  transform: {
    "^.+\\.js$": "babel-jest"
  },
  testMatch: ["**/__tests__/**/*_spec.js?(x)", "**/?(*.)(spec|test).js?(x)"],
  setupTestFrameworkScriptFile: `${__dirname}/jestFrameworkSetup.js`
};
