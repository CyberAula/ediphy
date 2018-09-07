let webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');
let path = require('path');

module.exports = merge.smart(common, {
    mode: "production",
    entry: {
        'app': [
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
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                uglifyOptions: {
                    compress: {
                        warnings: false,
                        // Disabled because of an issue with Uglify breaking seemingly valid code:
                        // https://github.com/facebookincubator/create-react-app/issues/2376
                        // Pending further investigation:
                        // https://github.com/mishoo/UglifyJS2/issues/2011
                        comparisons: false,
                    },
                    mangle: {
                        safari10: true,
                    },
                    output: {
                        comments: false,
                        // Turned on because emoji and regex is not minified properly using default
                        // https://github.com/facebookincubator/create-react-app/issues/2488
                        ascii_only: true,
                    },
                },
            }),
        ],
    },
});
