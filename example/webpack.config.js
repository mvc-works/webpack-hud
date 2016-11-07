
module.exports = {
  entry: {
    main: [
      'webpack/hot/only-dev-server',
      'webpack-dev-server/client?http://localhost:8080/',
      './main.js'
    ]
  },
  output: {
    filename: 'bundle.js',
    path: './example'
  },
  module: {
    rules: [
      {test: /\.js$/, loader: 'babel'},
      {test: /demo\.js$/, loader: 'eslint'}
    ]
  }
}