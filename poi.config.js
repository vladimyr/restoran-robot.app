const rules = [{
  test: /zepto(?:\.min)?\.js$/,
  use: ['imports-loader?this=>window', 'exports-loader?Zepto']
}, {
  test: /fetch\.js$/,
  use: ['imports-loader?self=>window', 'exports-loader?window.fetch']
}];

module.exports = (options, req) => ({
  entry: './index.js',
  presets: [
    require('poi-preset-buble')()
  ],
  html: {
    template: 'index.html'
  },
  sourceMap: options.mode === 'development',
  webpack(config) {
    config.module.rules.push(...rules);
    return config;
  }
});
