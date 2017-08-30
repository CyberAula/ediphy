let webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');
let path = require('path');

module.exports = merge.smart(common, {
    output: {
        path: path.join(__dirname, '/dist'),
        publicPath: '/', // This is used to generate URLs to e.g. images
        filename: 'prod/[name]-bundle.min.js',
    },
    devtool: 'source-map',
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false
            }
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })
    ]
});