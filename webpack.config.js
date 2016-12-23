'use strict';

const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const autoprefixer = require('autoprefixer');

// Autoprefixer config
const autoprefixerConfig = {
  browsers: [ 'last 2 versions', 'ie 10', 'ie 11' ],
  cascade: false
};

// Preload js with buble.
let preLoaders = [
  { test: /\.js$/, exclude: /mimetype\.js$/, loader: 'buble' }
];

// Loaders
let loaders = [
  { test: /zepto(?:\.min)?\.js$/, loader: 'imports?this=>window!exports?Zepto' },
  { test: /fetch\.js$/, loader: 'imports?self=>window!exports?window.fetch' },
  { test: /\.styl$/, loader: ExtractTextPlugin.extract('css!postcss!stylus') },
];

module.exports = {
  entry: './index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  postcss() { return [ autoprefixer(autoprefixerConfig) ]; },
  module: { loaders, preLoaders },
  plugins: [
    new ExtractTextPlugin('style.css')
  ]
};
