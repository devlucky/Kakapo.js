module.exports = {
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testMatch: ["**/__tests__/**/*_spec.ts?(x)", "**/?(*.)(spec|test).ts?(x)"],
  setupFilesAfterEnv: [`${__dirname}/jestFrameworkSetup.js`]
};
