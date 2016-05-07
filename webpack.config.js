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
        test: /\.js$/,
        loader: 'babel',
        include: __dirname,
        exclude: /node_modules/
      }
    ]
  }
};
