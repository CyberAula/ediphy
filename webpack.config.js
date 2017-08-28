let webpack = require('webpack');
let ZipBundlePlugin = require('./webpack_plugins/bundle_zip_plugin.js');
let dependency_loader = require('./webpack_plugins/dependencies_loader.js');

module.exports = {
    devtool: 'source-map',
    entry: {
        'app':[
            'webpack-dev-server/client?http://localhost:8080', // WebpackDevServer host and port
            'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
            'bootstrap-loader', //Loads Twitter Bootstrap
            __dirname + '/index.jsx'], // Appʼs entry point
        'js/visor': __dirname + '/_visor/containers/EditorVisor.jsx',
    },
    output: {
        path: __dirname + '/dist',
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
                        plugins: [require('babel-plugin-transform-object-rest-spread')]
                    }
                }
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015','react'],
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader",
                ]
            },
            {
                test: /\.(scss|sass)$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    'style-loader',
                    'css-loader',
                    { loader: 'sass-loader', options: { sourceMap: true } }
                ],
            },
            {
                test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2|json|xml|ico)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 100000
                        }
                    }
                ]
            },
            {
                test: require.resolve('jquery'),
                use: [{
                    loader: 'expose-loader',
                    options: '$'
                }]
            },
        ].concat(dependency_loader.getExposeString()),
    },
    resolve: {
        //resolve.alias could be useful for resolving certain modules easily
        extensions: ['.js', '.jsx', '.es6'],
    },
    devServer: {
        contentBase: './dist',
        hot: true,
    },
    plugins: [
        new webpack.ContextReplacementPlugin(/package\.json$/, "./plugins/"),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProvidePlugin(Object.assign({
            '$': 'jquery',
            'jQuery': 'jquery',
            'window.jQuery': 'jquery',
        }, dependency_loader.getPluginProvider())), // Wraps module with variable and injects wherever it's needed
        new ZipBundlePlugin(), // Compile automatically zips
    ],
};
