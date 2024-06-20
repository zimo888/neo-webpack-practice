const common = require('./webpack.common')
const webpackMerge = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
process.env.NODE_ENV = 'production';
module.exports = webpackMerge.merge(common, {
  mode: 'production',
  devtool: false,
  output:{
    clean: true,
    publicPath: '/',
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
        },
      }),
    ]
  }
})