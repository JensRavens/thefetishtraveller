const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');
const webpack = require('webpack');

const mode = process.env.NODE_ENV || 'development';
const config = {
  mode,
  entry: './src/index.tsx',
  output: {
    path: process.cwd() + '/public',
    filename: '[name].[hash].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: ['source-map-loader'],
        enforce: 'pre',
      },
      {
        test: /\.scss$/,
        use: [
          mode !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          mode !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.(svg)$/,
        use: [
          'file-loader',
          {
            loader: 'svgo-loader',
            options: {
              plugins: [
                { removeTitle: true },
                { convertColors: { shorthex: false } },
                { convertPathData: false },
              ],
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: ['file-loader'],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader'],
      },
      {
        test: /\.ya?ml$/,
        use: ['js-yaml-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'app.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[name]-[id]-[hash].css',
    }),
    new CopyWebpackPlugin([{ from: 'src/public' }]),
    new webpack.HotModuleReplacementPlugin(),
    new GenerateSW({
      swDest: 'serviceworker.js',
      clientsClaim: true,
      skipWaiting: true,
      navigateFallback: '/app.html',
      navigateFallbackDenylist: [/\/admin/],
    }),
  ],
  performance: {
    hints: false,
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
};

if (mode == 'development') {
  Object.assign(config, {
    devtool: 'cheap-module-source-map',
    devServer: {
      hot: true,
      historyApiFallback: true,
      disableHostCheck: true,
      watchOptions: {
        infoVerbosity: 'verbose',
      },
      index: 'app.html',
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          secure: false,
          changeOrigin: true,
        },
        '/graphql': {
          target: 'http://localhost:3000',
          secure: false,
          changeOrigin: true,
        },
      },
    },
  });
}

module.exports = config;
