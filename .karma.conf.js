module.exports = function(config) {
  config.set({
    browsers: ['Firefox'],
    frameworks: ['browserify', 'tap'],
    files: [
      'test/runners/karma.js'
    ],
    preprocessors: {
      'test/**/*.js': ['browserify']
    }
  });
};
