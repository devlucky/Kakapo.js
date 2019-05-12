module.exports = {
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  }
  testMatch: ["**/__tests__/**/*_spec.ts?(x)", "**/?(*.)(spec|test).ts?(x)"],
  setupTestFrameworkScriptFile: `${__dirname}/jestFrameworkSetup.js`
};
