let webpack = require('webpack');

let ProgressBarPlugin = require('progress-bar-webpack-plugin');
const marked = require("marked");
const renderer = new marked.Renderer();

module.exports = {
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
                        presets: ['@babel/env'],
                        plugins: [require('@babel/plugin-proposal-object-rest-spread')],
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
                    },
                },
            },
            {
                test: /\.md$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "html-loader",
                    },
                    {
                        loader: "markdown-loader",
                        options: {
                            pedantic: true,
                            renderer,
                        },
                    },
                ],
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
        ],
    },
    resolve: {
        // resolve.alias could be useful for resolving certain modules easily
        extensions: ['.js', '.jsx', '.es6'],
    },
    plugins: [
        new ProgressBarPlugin({}),
        new webpack.ProvidePlugin(Object.assign({
            '$': 'jquery',
            'jQuery': 'jquery',
            'window.jQuery': 'jquery',
        })), // Wraps module with variable and injects wherever it's needed
    ],
};

// 'webpack-dev-server/client?http://localhost:8080', // WebpackDevServer host and port
// 'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
// 'bootstrap-loader', // Loads Twitter Bootstrap
