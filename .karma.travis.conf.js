module.exports = function(config) {
  config.set({
    browsers: ['Firefox'],
    frameworks: ['browserify', 'tap'],
    files: [
      'tests/runners/travis.js'
    ],
    preprocessors: {
      'tests/**/*.js': ['browserify']
    }
  });
};
