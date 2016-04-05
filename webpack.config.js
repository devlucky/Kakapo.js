const path = require('path');

module.exports = {
  entry: [
    'babel-polyfill',
    './index.js'
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015']
      }
    }]
  },
  output: {
    path: './dist',
    filename: 'app.js'
  }
};