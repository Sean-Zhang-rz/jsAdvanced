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
      {
        test: /\.s[ac]ss$/i, // 处理less文件
        use: [
          'style-loader', // 将css文件变成commonjs模块加载js中，里面样式内容是字符串
          'css-loader', // 将less文件编译成css文件
          'sass-loader', // 需要下载less-loader和less
        ],
      },
    ],
  },
};
