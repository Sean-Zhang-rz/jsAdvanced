const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { resolve } = require('path');

const mode = 'production';
const cssLoader = (...loaders) => [
  mode === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
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
console.log(resolve(__dirname, 'Webpack', 'src', 'admin.js'));
module.exports = {
  mode,
  entry: {
    main: './Webpack/src/index.js',
    // admin: './src/admin.js',
    admin: resolve(__dirname, 'Webpack', 'src', 'admin.js'),
  },
  plugins: [
    new ESLintPlugin({
      extensions: ['.js', '.jsx'],
    }),
    mode === 'production' &&
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
      }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      chunks: ['main'],
    }),
    new HtmlWebpackPlugin({
      filename: 'admin.html',
      chunks: ['admin'],
    }),
  ].filter(Boolean),
  output: {
    filename: '[name].[contenthash].js',
  },
  optimization: {
    moduleIds: 'deterministic',
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          priority: 6,
          minSize: 0, // 如果不写0，由于React文件尺寸太小，会直接跳过
          test: /[\\/]node_modules[\\/]/, // 为了匹配/node_modules/ 或\node_modules\
          name: 'vendors', // 文件名
          chunks: 'all', // all表示同步加载和一部加载，async表示异步加载，initial表示同步加载
        },
        common: {
          priority: 5,
          minSize: 0,
          minChunks: 2,
          chunks: 'all',
          name: 'common',
        },
      },
    },
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
