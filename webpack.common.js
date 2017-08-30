let webpack = require('webpack');
let ZipBundlePlugin = require('./webpack_plugins/bundle_zip_plugin.js');
let dependency_loader = require('./webpack_plugins/dependencies_loader.js');
let path = require('path');
var ProgressBarPlugin = require('progress-bar-webpack-plugin');

module.exports = {
    entry: {
        'app': [
            'webpack-dev-server/client?http://localhost:8080', // WebpackDevServer host and port
            'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
            'bootstrap-loader', // Loads Twitter Bootstrap
            './index.jsx'
        ], // Appʼs entry point
        'js/visor': path.join(__dirname, '/_visor/containers/EditorVisor.jsx'),
    },
    output: {
        path: path.join(__dirname, '/dist'),
        publicPath: '/', // This is used to generate URLs to e.g. images
        filename: '[name]-bundle.js',
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.(es6|jsx|js)$/,
                use: ['eslint-loader'],
                exclude: [/node_modules/],
            },
            {
                test: /\.es6$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015'],
                        plugins: [require('babel-plugin-transform-object-rest-spread')],
                    },
                },
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015', 'react'],
                    },
                },
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader",
                ],
            },
            {
                test: /\.(scss|sass)$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    'style-loader',
                    'css-loader',
                    { loader: 'sass-loader', options: { sourceMap: true } },
                ],
            },
            {
                test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2|json|xml|ico)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1000000,
                        },
                    },
                ],
            },
            {
                test: require.resolve('jquery'),
                use: [{
                    loader: 'expose-loader',
                    options: '$',
                }],
            },
        ].concat(dependency_loader.getExposeString()),
    },
    resolve: {
        // resolve.alias could be useful for resolving certain modules easily
        extensions: ['.js', '.jsx', '.es6'],
    },
    plugins: [
        new ProgressBarPlugin({}),
        new webpack.ContextReplacementPlugin(/package\.json$/, "./plugins/"),
        new webpack.ProvidePlugin(Object.assign({
            '$': 'jquery',
            'jQuery': 'jquery',
            'window.jQuery': 'jquery',
        }, dependency_loader.getPluginProvider())), // Wraps module with variable and injects wherever it's needed
        new ZipBundlePlugin(), // Compile automatically zips
    ],
};

//'webpack-dev-server/client?http://localhost:8080', // WebpackDevServer host and port
//'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
//'bootstrap-loader', // Loads Twitter Bootstrap