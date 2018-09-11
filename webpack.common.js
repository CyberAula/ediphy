let webpack = require('webpack');
let ZipBundlePlugin = require('./webpack_plugins/bundle_zip_plugin.js');
let dependency_loader = require('./webpack_plugins/dependencies_loader.js');
let path = require('path');
let ProgressBarPlugin = require('progress-bar-webpack-plugin');
const { styles } = require('@ckeditor/ckeditor5-dev-utils');
const CKEditorWebpackPlugin = require('@ckeditor/ckeditor5-dev-webpack-plugin');

module.exports = {
    node: {
        fs: 'empty',
    },
    module: {
        rules: [
            {
                // test: /\.svg$/,
                test: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
                exclude: [/node_modules/],
                use: ['raw-loader'],
            },
            // {
            //     test: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css/,
            //     exclude: [/node_modules/],
            //     use: [
            //         {
            //             loader: 'style-loader',
            //             options: {
            //                 singleton: true,
            //             },
            //         },
            //         {
            //             loader: 'postcss-loader',
            //             options: styles.getPostCssConfig({
            //                 themeImporter: {
            //                     themePath: require.resolve('@ckeditor/ckeditor5-theme-lark'),
            //                 },
            //                 minify: true,
            //             }),
            //         },
            //     ],
            // },
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
                test: /\.(js|jsx|es6|json)$/,
                exclude: /node_modules/,
                include: '/node_modules/@ckeditor/',
                type: 'javascript/auto',
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/,
                // exclude: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css/,
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
            {
                test: /\.ejs$/,
                use: [{
                    loader: 'ejs-compiled-loader',
                }],
            },
        ].concat(dependency_loader.getExposeString()),
    },
    resolve: {
        // resolve.alias could be useful for resolving certain modules easily
        extensions: ['.js', '.jsx', '.es6', '.json'],
        modules: ['./node_modules', './plugins'],

    },
    externals: {
        'jsdom': 'window',
        'cheerio': 'window',
        'react/lib/ExecutionEnvironment': true,
        'react/addons': true,
        'react/lib/ReactContext': 'window',
        'entities': 'window',
        "ckeditor5": "CKE5",
    },

    plugins: [
        new CKEditorWebpackPlugin({
            // See https://ckeditor.com/docs/ckeditor5/latest/features/ui-language.html
            language: 'en',
        }),
        new ProgressBarPlugin({}),
        // new webpack.ContextReplacementPlugin(/package\.json$/, "./plugins/"),
        new webpack.ProvidePlugin(Object.assign({
            '$': 'jquery',
            'jQuery': 'jquery',
            'window.jQuery': 'jquery',
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
