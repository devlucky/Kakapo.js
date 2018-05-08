module.exports = {
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  setupTestFrameworkScriptFile: `${__dirname}/jestFrameworkSetup.js`,
};