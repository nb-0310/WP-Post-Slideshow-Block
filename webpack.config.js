const defaultConfig = require('@wordpress/scripts/config/webpack.config');

module.exports = {
  ...defaultConfig,
  entry: {
    'block': './src/js/block.js',
  },
  output: {
    path: __dirname + '/dist/js',
    filename: '[name].js',
  },
};
