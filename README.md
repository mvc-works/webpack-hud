## Webpack HUD, displaying errors in app

![Webpack TypeScript demo](https://pbs.twimg.com/media/DlB9RKGUwAMWvBh.png:large)

### Usage

```bash
npm i --save-dev webpack-hud
```

```js
module.exports = {
  entry: {
    main: [
      "webpack-hud", // <-- put package here, before your code
      "./src/main",
    ],
  },
  output: {
    filename: "bundle.js",
    path: "build/",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};
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
