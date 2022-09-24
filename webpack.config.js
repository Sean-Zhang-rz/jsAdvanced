const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const cssLoader = (...loaders) => [
  MiniCssExtractPlugin.loader,
  {
    loader: 'css-loader',
    options: {
      modules: {
        compileType: 'icss',
      },
    },
  },
  ...loaders,
];
module.exports = {
  mode: 'production',
  plugins: [
    new ESLintPlugin({
      extensions: ['.js', '.jsx'],
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    new HtmlWebpackPlugin(),
  ],
  output: {
    filename: '[name].[contenthash].js',
  },
  // 路径别名
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      src: path.resolve(__dirname, './Webpack/src/'),
    },
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env'],
              ['@babel/preset-react', { runtime: 'classic' }],
              ['@babel/preset-typescript'],
            ],
          },
        },
      },
      {
        test: /\.less$/,
        use: cssLoader({
          loader: 'less-loader',
          options: {
            additionalData: `
                @import "~src/less-vars.less";
              `,
            lessOptions: {
              includePaths: [__dirname],
            },
          },
        }),
      },
      {
        test: /\.s[ac]ss$/i,
        use: cssLoader({
          loader: 'sass-loader',
          options: {
            additionalData: `
                @import "~src/scss-vars.scss";
              `,
            sassOptions: {
              includePaths: [__dirname],
            },
          },
        }),
      },
    ],
  },
};
