let webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
let path = require('path');

module.exports = merge.smart( common, {
    output: {
        path: path.join(__dirname, '/dist'),
        publicPath: '/', // This is used to generate URLs to e.g. images
        filename: '[name]-bundle.js',
    },
    devtool: 'cheap-module-eval-source-map',
    watch: true,
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.LoaderOptionsPlugin({
            debug: true
        })
    ],
    devServer: {
        contentBase: __dirname + "/dist",
        inline:true,
        port: 8080
    }
});