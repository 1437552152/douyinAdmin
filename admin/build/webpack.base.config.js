/*
 * @Description:
 * @version:
 * @Date: 2019-08-20 00:29:21
 * @LastEditors: yfye
 * @LastEditTime: 2021-01-22 23:44:08
 * @Author: yeyifu
 * @LastModifiedBy: yeyifu
 */
const path = require('path');
const os = require('os');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HappyPack = require('happypack');
var happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

function resolve (dir) {
    return path.join(__dirname, dir);
}


module.exports = {
    entry: {
        main: ["./node_modules/babel-polyfill/dist/polyfill.js","@/main"],
        'vender-base': '@/vendors/vendors.base.js',
        'vender-exten': '@/vendors/vendors.exten.js'
    },
    output: {
        path: path.resolve(__dirname, '../dist/dist')
    },
    module: {
        rules: [{
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                loaders: {
                    less: ExtractTextPlugin.extract({
                        use: ['css-loader?minimize', 'autoprefixer-loader', 'less-loader'],
                        fallback: 'vue-style-loader'
                    })
                },
                loaders: {
                    css: 'vue-style-loader!css-loader',
                    less: 'vue-style-loader!css-loader!less-loader'
                },
                postLoaders: {
                    html: 'babel-loader'
                }
            }
        },
        {
            test: /iview\/.*?js$/,
            loader: 'happypack/loader?id=happybabel',
            exclude: /node_modules/
        },
        {
            test: /\.js$/,
            loader: 'happypack/loader?id=happybabel',
            exclude: /node_modules/
        },
        {
            test: /\.js[x]?$/,
            include: [resolve('src')],
            exclude: /node_modules/,
            loader: 'happypack/loader?id=happybabel'
        },
        {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                use: ['css-loader?minimize', 'autoprefixer-loader'],
                fallback: 'style-loader'
            })
        },
        {
            test: /\.less$/,
            use: ExtractTextPlugin.extract({
                use: ['autoprefixer-loader', 'less-loader'],
                fallback: 'style-loader'
            })
        },
        {
            test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
            loader: 'url-loader?limit=1024'
        },
        {
            test: /\.(html|tpl)$/,
            loader: 'html-loader'
        }
        ]
    },
    plugins: [
        new HappyPack({
            id: 'happybabel',
            loaders: ['babel-loader'],
            threadPool: happyThreadPool,
            verbose: true
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        })
    ],
    resolve: {
        extensions: ['.js', '.vue'],
        alias: {
            'vue': 'vue/dist/vue.esm.js',
            '@': resolve('../src')
        }
    }
};
