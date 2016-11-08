
module.exports = {
  entry: {
    main: [
      './main.js'
    ]
  },
  output: {
    filename: 'bundle.js',
    path: '/example'
  },
  module: {
    rules: [
      {test: /\.js$/, loader: 'babel'},
      {enforce: "pre", test: /demo\.js$/, loader: 'eslint'}
    ]
  }
}