module.exports = function(config) {
  config.set({
    browsers: ['Firefox'],
    coverageReporter: {
      reporters: [
        {
          type: 'lcov',
          dir: 'tests/coverage/'
        }
      ]
    },
    frameworks: ['browserify', 'tap'],
    files: [
      'tests/runners/travis.js'
    ],
    preprocessors: {
      'tests/**/*.js': ['browserify']
    },
    reporters: ['progress', 'coverage']
  });
};
