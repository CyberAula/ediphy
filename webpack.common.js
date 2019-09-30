let webpack = require('webpack');
let ZipBundlePlugin = require('./webpack_plugins/bundle_zip_plugin.js');
let dependency_loader = require('./webpack_plugins/dependencies_loader.js');
let path = require('path');
let ProgressBarPlugin = require('progress-bar-webpack-plugin');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
const dotenv = require('dotenv');

// call dotenv and it will return an Object with a parsed key
const env = dotenv.config().parsed;

// reduce it to a nice object, the same as before
const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
}, {});

module.exports = {
    node: {
        fs: 'empty',
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
                test: /pdf\.worker(\.min)?\.js$/,
                use: 'raw-loader',
            },
            {
                test: /\.es6$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/env'],
                        plugins: [require('@babel/plugin-proposal-object-rest-spread').default],
                    },
                },
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/env', '@babel/preset-react'],
                        plugins: [require('@babel/plugin-proposal-class-properties').default],

                    },
                },
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "postcss-loader",
                ],
            },
            {
                test: /\.(scss|sass)$/,
                exclude: /(node_modules|bower_components|scss-files|themes.scss)/,
                use: [
                    'style-loader',
                    'css-loader',
                    { loader: 'sass-loader', options: { sourceMap: true } },
                ],
            },
            {
                test: /scss-files/,
                exclude: /(node_modules|bower_components)/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader',
                        { loader: 'sass-loader', options: { sourceMap: true } },
                    ],
                }),

            },
            {
                test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2|json|xml|ico)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            name: 'images/[hash]-[name].[ext]',
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
            }, {
                test: /\.ejs$/,
                use: [{
                    loader: 'ejs-compiled-loader',
                }],
            },
        ].concat(dependency_loader.getExposeString()),
    },
    resolve: {
        // resolve.alias could be useful for resolving certain modules easily
        extensions: ['.js', '.jsx', '.es6'],
    },

    plugins: [
        new ExtractTextPlugin({ filename: '[name].css' }),
        new ProgressBarPlugin({}),
        new webpack.ContextReplacementPlugin(/package\.json$/, "./plugins/"),
        new webpack.DefinePlugin(envKeys),
        new webpack.ProvidePlugin(Object.assign({
            '$': 'jquery',
            'jQuery': 'jquery',
            'window.jQuery': 'jquery',
            'window.$': 'jquery',
        }, dependency_loader.getPluginProvider())), // Wraps module with variable and injects wherever it's needed
        new ZipBundlePlugin(), // Compile automatically zips
        new webpack.NormalModuleReplacementPlugin(
            /pdf\.worker(\.min)?\.js$/,
            path.join(__dirname, 'node_modules', 'pdfjs-dist', 'build', 'pdf.worker.min.js')),
    ],
};

// 'webpack-dev-server/client?http://localhost:8080', // WebpackDevServer host and port
// 'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
// 'bootstrap-loader', // Loads Twitter Bootstrap
