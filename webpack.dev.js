let webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
let path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge.smart(common, {
    entry: {
        'app': [
            'webpack-dev-server/client?http://localhost:8080', // WebpackDevServer host and port
            'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
            'bootstrap-loader', // Loads Twitter Bootstrap
            './index.jsx',
        ], // Appʼs entry point
        'visor': path.join(__dirname, '/_visor/containers/VisorApp.jsx'),
        'theme': path.join(__dirname, '/common/themes/cssImporter.js'),
    },
    output: {
        path: path.join(__dirname, '/dist'),
        publicPath: '/', // This is used to generate URLs to e.g. images
        filename: '[name]-bundle.js',
    },
    devtool: 'cheap-module-eval-source-map',
    watch: true,
    plugins: [
        // new BundleAnalyzerPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.LoaderOptionsPlugin({
            debug: true,
        }),
    ],
    devServer: {
        contentBase: path.join(__dirname, '/dist'),
        hot: true,
        inline: true,
        port: 8080,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    },
});
