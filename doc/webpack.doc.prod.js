let webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.doc.common.js');
let path = require('path');

module.exports = merge.smart(common, {
    entry: {
        'doc': [
            path.join(__dirname, '/index.jsx'),
        ],

    },
    output: {
        path: path.join(__dirname, '/dist'),
        publicPath: '/', // This is used to generate URLs to e.g. images
        filename: '[name]-bundle.js',
    },
    devtool: 'source-map',
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false,
            },
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production'),
            },
        }),
    ],
});
// eslint-disable-next-line no-console
console.log('App will be served in doc/dist  ✓\n\n\n');

