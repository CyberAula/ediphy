let webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge.smart( common, {
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