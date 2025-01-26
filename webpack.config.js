const defaultConfig = require('@wordpress/scripts/config/webpack.config');

module.exports = {
  ...defaultConfig,
  entry: {
    'block': './src/js/block.js',
    'render': './src/js/render.js'
  },
  output: {
    path: __dirname + '/dist/',
    filename: '[name].js',
  },
};
