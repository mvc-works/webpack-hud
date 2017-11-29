
Webpack HUD, displaying errors in app
----

[![](https://pbs.twimg.com/media/CjrPoAWUYAE_77K.png:large)](https://www.youtube.com/watch?v=i-qGt-7nxVg)

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
And an element is appended to the `<body />` to display the content.

### Develop

```bash
cd example/
../node_modules/.bin/webpack-dev-server --hot-only --hot
```

### License

MIT
