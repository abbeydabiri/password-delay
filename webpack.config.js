const webpack = require('webpack'); //to access built-in plugins
const path = require('path');

var SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

module.exports = {
  entry: {
    website: "./ui/src/#routes.js",
    dashboard: "./ui/src/dashboard/#routes.js",
    admin: "./ui/src/admin/#routes.js",
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
  },
  plugins: [
    new SWPrecacheWebpackPlugin(
      {
        cacheId: 'passwordDelayV100',
        dontCacheBustUrlsMatching: /\.\w{8}\./,
        filename: 'service-worker.js',
        minify: true,
        navigateFallback: '/',
        staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
      }
    ),
  ],
}
