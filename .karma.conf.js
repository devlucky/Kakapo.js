module.exports = function(config) {
  config.set({
    browsers: ['Chrome'],
    frameworks: ['browserify', 'tap'],
    files: [
      'tests/karma.js'
    ],
    preprocessors: {
      'tests/**/*.js': ['browserify']
    }
  });
};
