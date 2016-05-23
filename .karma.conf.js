module.exports = function(config) {
  config.set({
    browsers: ['Firefox'],
    client: {
      captureConsole: false
    },
    frameworks: ['browserify', 'tap'],
    files: [
      'test/runners/karma.js'
    ],
    preprocessors: {
      'test/**/*.js': ['browserify']
    },
    reporters: ['story', 'nyan']
  });
};
