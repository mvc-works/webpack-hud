
Webpack HUD, for showing error messages
----

> ...make Webpack look like [Figwheel](https://github.com/bhauman/lein-figwheel).

Demo https://www.youtube.com/watch?v=i-qGt-7nxVg

### Usage

```bash
npm i --save-dev webpack-hud
```

```js
module.exports = {
  entry: {
    main: [
      'webpack/hot/only-dev-server',
      'webpack-dev-server/client?http://localhost:8080/',
      'webpack-hud', // <-- put file here, maybe...
      './src/main.js'
    ]
  },
  output: {
    filename: 'bundle.js',
    path: 'build/'
  },
  module: {
    loaders: [
      {test: /\.json$/, loader: 'json'} // <-- need this for json
    ]
  }
}
```

### License

MIT
