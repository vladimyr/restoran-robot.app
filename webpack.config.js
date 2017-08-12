'use strict';

const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const postcss = {
  loader: 'postcss-loader',
  options: {
    sourceMap: true,
    plugins: loader => [
      require('autoprefixer')({
        browsers: [ 'last 2 versions', 'ie 10', 'ie 11' ],
        cascade: false
      })
    ]
  }
}

const rules = [{
  // Preload js with buble
  test: /\.js$/,
  enforce: 'pre',
  exclude: /mimetype\.js$/,
  loader: 'buble-loader'
}, {
  test: /zepto(?:\.min)?\.js$/,
  use: ['imports-loader?this=>window', 'exports-loader?Zepto']
}, {
  test: /fetch\.js$/,
  use: ['imports-loader?self=>window', 'exports-loader?window.fetch']
}, {
  test: /\.styl$/,
  use: ExtractTextPlugin.extract({
    use: ['css-loader', postcss, 'stylus-loader']
  })
}];

module.exports = {
  entry: './index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: { rules },
  plugins: [
    new ExtractTextPlugin('style.css'),
    new CopyWebpackPlugin([{ from: 'index.html' }])
  ]
};
