let webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.doc.common.js');
let path = require('path');

module.exports = merge.smart(common, {
    entry: {
        'doc': [
            'webpack-dev-server/client?http://localhost:8082/', // WebpackDevServer host and port
            'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
            // 'bootstrap-loader', // Loads Twitter Bootstrap
            path.join(__dirname, '/index.jsx'),
        ],
    },
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
            debug: true,
        }),
    ],
    devServer: {
        contentBase: path.join(__dirname, '/dist'),
        hot: true,
        inline: true,
        port: 8082,
        historyApiFallback: true,
    },
});

