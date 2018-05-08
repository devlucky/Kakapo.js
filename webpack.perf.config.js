const path = require('path');

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, './perf/index.js'),
  output: {
    filename: './perf/dist/bundle.js',
  },
  resolve: {
    extensions: [".js", ".jsx"]
  },
  module: {
    rules: [
      { test: /\.jsx?$/, loader: 'babel-loader', exclude: /(node_modules)/ }
    ]
  }
};
