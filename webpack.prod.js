let webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');
let path = require('path');

module.exports = merge.smart(common, {
    entry: {
        'app': [
            'babel-polyfill',
            'bootstrap-loader', // Loads Twitter Bootstrap
            './index.jsx',
        ], // Appʼs entry point
        'visor': path.join(__dirname, '/_visor/containers/VisorApp.jsx'),
    },
    output: {
        path: path.join(__dirname, '/dist'),
        publicPath: '/', // This is used to generate URLs to e.g. images
        filename: 'prod/[name]-bundle.min.js',
    },
    devtool: 'cheap-module-source-map',
    // devtool: 'cheap-module-eval-source-map', // for dev in prod enviroment
    externals: {
        ediphy_editor_params: 'ediphy_editor_params',
        ediphy_editor_json: 'ediphy_editor_json',
    },
    plugins: [
        // new webpack.optimize.OccurrenceOrderPlugin(),
        // new webpack.optimize.ModuleConcatenationPlugin(),
        // new webpack.LoaderOptionsPlugin({ options: {} }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production'),
            },
        }),
    ],
});
