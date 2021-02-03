/*
 * @Description: 
 * @version: 
 * @Date: 2019-08-20 00:29:21
 * @LastEditors: yfye
 * @LastEditTime: 2021-01-22 23:11:41
 * @Author: yeyifu
 * @LastModifiedBy: yeyifu
 */
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const cleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsParallelPlugin = require('webpack-uglify-parallel');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const os = require('os');
const fs = require('fs');
const path = require('path');
const package = require('../package.json');
const CompressionPlugin = require('compression-webpack-plugin');

// fs.open('./build/env.js', 'w', function(err, fd) {
//   const buf = 'export default "production";';
//   fs.write(fd, buf, 0, buf.length, 0, function(err, written, buffer) {});
// });

module.exports = merge(webpackBaseConfig, {
  output: {
    publicPath: '/admin/dist/', //114 test
    filename: '[name].[hash].js',
    chunkFilename: '[name].[hash].chunk.js'
  },
  plugins: [
    new cleanWebpackPlugin(['dist/*'], {
      root: path.resolve(__dirname, '../')
    }),
    new ExtractTextPlugin({
      filename: '[name].[hash].css',
      allChunks: true
    }),
    new CompressionPlugin({
      algorithm: 'gzip', // 使用gzip压缩
      test: /\.js$|\.html$|\.css$/, // 匹配文件名
      filename: '[path].gz[query]', // 压缩后的文件名(保持原文件名，后缀加.gz)
      minRatio: 1, // 压缩率小于1才会压缩
      threshold: 10240, // 对超过10k的数据压缩
      deleteOriginalAssets: false, // 是否删除未压缩的源文件，谨慎设置，如果希望提供非gzip的资源，可不设置或者设置为false（比如删除打包后的gz后还可以加载到原始资源文件）
  }),
    new webpack.optimize.CommonsChunkPlugin({
      // name: 'vendors',
      // filename: 'vendors.[hash].js'
      name: ['vender-exten', 'vender-base'],
      minChunks: Infinity
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    // new UglifyJsParallelPlugin({
    //     workers: os.cpus().length,
    //     mangle: true,
    //     compressor: {
    //       warnings: false,
    //       drop_console: true,
    //       drop_debugger: true
    //      }
    // }),
    new CopyWebpackPlugin([{
        from: 'favicon.ico'
      },
      {
        from: 'src/styles/fonts',
        to: 'fonts'
      },
      {
        from: 'src/views/main-components/theme-switch/theme'
      }
    ], {
      ignore: [
        // 'text-editor.vue'
      ]
    }),
    new HtmlWebpackPlugin({
      title: '西瓜数据',
      favicon: './favicon.ico',
      filename: '../index.html',
      template: './src/template/index.ejs',
      inject: false
    })
  ]
});