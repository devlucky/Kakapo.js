module.exports = function(config) {
  config.set({
    browsers: ['Firefox'],
    client: {
      captureConsole: false
    },
    coverageReporter: {
      reporters: [
        {
          type: 'lcov',
          dir: 'test/coverage/'
        }
      ]
    },
    frameworks: ['browserify', 'tap'],
    files: [
      'test/runners/travis.js'
    ],
    preprocessors: {
      'test/**/*.js': ['browserify']
    },
    reporters: ['story', 'coverage']
  });
};
