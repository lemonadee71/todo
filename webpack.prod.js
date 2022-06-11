const path = require('path');
const merge = require('webpack-merge');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: 'main.[contenthash].js',
    path: path.resolve(__dirname, 'public'),
    clean: true,
  },
  devtool: 'source-map',
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'main.[contenthash].css',
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        include: path.resolve(__dirname, 'src'),
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // Specifies a custom public path for the external resources like images, files, etc inside CSS
              publicPath: '',
            },
          },
          'css-loader',
          'postcss-loader',
        ],
      },
    ],
  },
});
