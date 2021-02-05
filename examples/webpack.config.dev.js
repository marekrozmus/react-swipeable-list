const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const babelLoaderOptions = {
  presets: ['@babel/env', '@babel/react'],
  plugins: ['@babel/plugin-proposal-class-properties'],
};

module.exports = {
  devServer: {
    port: 3000,
    open: true,
    inline: true,
    hot: true,
    watchOptions: {
      ignored: /node_modules/,
    },
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: babelLoaderOptions,
        },
      },
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: path.join(__dirname, 'src', 'examples'),
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: './index.html',
    }),
  ],
  resolve: {
    alias: {
      // replace with any css - cannot ignore this import
      'react-swipeable-list/dist/styles.css': path.join(
        __dirname,
        'src',
        'App.css'
      ),

      // to import module sources
      'react-swipeable-list': path.join(__dirname, '..', 'src'),

      // to make the module use same react as example
      // (otherwise even if same version is in module sources used
      // we get error about duplicated react and cannot use hooks)
      react: path.resolve(__dirname, 'node_modules', 'react'),
      'prop-types': path.resolve(__dirname, 'node_modules', 'prop-types'),
    },
    extensions: ['.js'],
  },
};
