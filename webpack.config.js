module.exports = {
  entry: './src',
  output: {
    path: './lib',
    filename: 'kakapo.js',
    publicPath: '/'
  },
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        include: __dirname,
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  }
};
