module.exports = {
  entry: './src/kakapo.js',
  output: {
    publicPath: 'http://localhost:8090/assets',
    path: './dist',
    filename: 'kakapo.js',
    libraryTarget: 'umd',
    library: 'Kakapo'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel'
    }]
  },
  resolve: {
    extensions: ['', '.js']
  }
};