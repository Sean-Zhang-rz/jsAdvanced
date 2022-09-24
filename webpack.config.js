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
        test: /\.s[ac]ss$/i, // 处理less文件
        use: [
          'style-loader', // 将css文件变成commonjs模块加载js中，里面样式内容是字符串
          {
            loader: 'css-loader',
            options: {
              modules: {
                compileType: 'icss',
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              additionalData: `
                @import "~src/scss-vars.scss";
              `,
              sassOptions: {
                includePaths: [__dirname],
              },
            },
          },
        ],
      },
    ],
  },
};
