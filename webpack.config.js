
module.exports = {
  entry: {
    main: [
      'webpack/hot/only-dev-server',
      'webpack-dev-server/client?http://localhost:8080/',
      // './src/hud.js',
      './src/main.js'
    ]
  },
  output: {
    filename: 'bundle.js',
    path: 'build/'
  },
  module: {
    loaders: [
      {test: /\.js$/, loader: 'eslint'}
    ]
  },
  eslint: {
    emitWarning: true
  }
}