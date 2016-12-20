
var path = require('path');

module.exports = {
  entry: {
    main: [
      './main.js'
    ]
  },
  performance: {
    hints: false
  },
  output: {
    filename: 'bundle.js',
    path: '/example'
  },
  module: {
    rules: [
      {test: /\.js$/, loader: 'babel-loader'},
      {enforce: "pre", test: /demo\.js$/, loader: 'eslint-loader',
        query: {
          emitWarning: true,
          configFile: path.join(__dirname, '../.eslintrc.json')
        }
      }
    ]
  }
}
