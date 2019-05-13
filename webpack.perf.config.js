const path = require('path');

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, './perf/index.js'),
  output: {
    filename: './perf/dist/bundle.js',
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        include: __dirname,
        exclude: [/node_modules/]
      },
    ]
  }
};
