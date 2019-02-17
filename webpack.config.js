const merge = require('webpack-merge');
const defaultConfig = require('@nerdgeschoss/config/webpack.config');
const mode = process.env.NODE_ENV || 'development';

const customConfig = {
  output: {
    path: process.cwd() + '/public',
  },
};

if (mode == 'development') {
  Object.assign(customConfig, {
    devServer: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          secure: false,
          changeOrigin: true,
        },
      },
      contentBase: './public',
    },
  });
}

defaultConfig.plugins.pop(); // remove copy plugin

module.exports = merge(defaultConfig, customConfig);
