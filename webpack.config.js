const webpack = require('webpack'); //to access built-in plugins
const path = require('path');

module.exports = {
  entry: {
    website: "./ui/src/#routes.js",
    dashboard: "./ui/src/dashboard/#routes.js",
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "./ui/assets/bin")
  },
  module: {
      loaders: [{
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
      }]
  }
}
