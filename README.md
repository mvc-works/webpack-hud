
Webpack HUD, for displaying errors in page
----

![](https://pbs.twimg.com/media/CjrPoAWUYAE_77K.png:large)

> ...like [Figwheel](https://github.com/bhauman/lein-figwheel).

Demo https://www.youtube.com/watch?v=i-qGt-7nxVg

Warning message in the demo is genetated
by [eslint-loader](https://github.com/MoOx/eslint-loader)
with [`cooking`](http://cookingjs.github.io/).

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
      'webpack-hud', // <-- put package here, before your code
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
```

### How does it work?

I copied the code to started another Sockjs channel listening to Webpack compilation results.
And an element is appended to the `<body>` to display the content.
This solution works in Webpack 1, but I'm not sure about Webpack 2.

### License

MIT
