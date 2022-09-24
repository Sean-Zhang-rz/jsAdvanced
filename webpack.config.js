const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  mode: 'production',
  plugins: [
    new ESLintPlugin({
      extensions: ['.js', '.jsx'],
    }),
  ],
  // 路径别名
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
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
    ],
  },
};
