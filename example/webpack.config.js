var path = require("path");

module.exports = {
  mode: "development",
  entry: {
    main: ["./main"],
  },
  performance: {
    hints: false,
  },
  output: {
    filename: "bundle.js",
    path: "/example",
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
