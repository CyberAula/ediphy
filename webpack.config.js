var webpack = require('webpack');
var ZipBundlePlugin = require('./webpack_plugins/bundle_zip_plugin.js');
var dependency_loader = require('./webpack_plugins/dependencies_loader.js');


module.exports = {
    devtool: 'source-map',
    entry: {
        'app': [
            'webpack-dev-server/client?http://localhost:8080', // WebpackDevServer host and port
            'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
            'bootstrap-loader', //Loads Twitter Bootstrap
            './index.jsx' // Appʼs entry point
            ],
        'js/visor': './core/visor_entrypoint.es6',
    },
    module: {
        preLoaders: [
            {
                test: /\.(es6|jsx|js)$/,
                exclude: /node_modules/,
                loader: 'jshint-loader'
            }
        ],
        loaders: [
            {
                test: /\.es6$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015'],
                    plugins: ['transform-object-rest-spread']
                }
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'react-hot-loader/webpack!babel-loader?presets[]=es2015,presets[]=react'
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                loader: 'style-loader!css-loader!sass-loader'
            },
            {
                test: /\.(jpg|gif|png)$/,
                loader: 'url-loader?limit=100000'
            },
            {
                test: /\.(woff2?|svg)$/,
                loader: 'url-loader?limit=10000' },
            {
                test: /\.(ttf|eot)$/,
                loader: 'file-loader'
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: require.resolve('jquery'),
                loader: 'expose?jQuery!expose?$!expose?window.jQuery'  //expose-loader, exposes as global variable
            }
        ].concat(dependency_loader.getExposeString())
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.es6']
    },
    output: {
        path: './dist',
        publicPath: '/', //This is used to generate URLs to e.g. images
        filename: '[name]-bundle.js'
    },
    devServer: {
        contentBase: './dist',
        hot: true
    },
    jshint: {
        // http://www.jshint.com/docs/options/

        // This option prohibits the use of bitwise operators such as ^ (XOR), | (OR) and others.
        // Bitwise operators are very rare in JavaScript programs and quite often & is simply a mistyped &&
        bitwise: true,

        // This option requires you to always put curly braces around blocks in loops and conditionals
        curly: true,

        // This options prohibits the use of == and != in favor of === and !==
        eqeqeq: true,

        // This option is used to specify the ECMAScript version to which the code must adhere
        esversion: 6,

        // This option requires all for in loops to filter object's items. The for in statement
        // allows for looping through the names of all of the properties of an object including
        // those inherited through the prototype chain.
        //forin: true,

        //This options prohibits overwriting prototypes of native objects such as Array, Date and so on.
        freeze: true,

        // This option requires the code to run in ECMAScript 5's strict mode.
        //strict: true,

        // This option prohibits the use of explicitly undeclared variables.
        undef: true,

        // This option warns when you define and never use your variables.
        unused: false,

        // This option suppresses warnings about functions inside of loops.
        loopfunc: true,

        // These options let JSHint know about some pre-defined global variables
        browser: true,
        devel: true,
        jquery: true,
        predef: ["Dali", "html2json", "CKEDITOR", "EJS"].concat(dependency_loader.getJSHintExludeNames())

    },
    plugins: [
        new webpack.ContextReplacementPlugin(/package\.json$/, "./plugins/"),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProvidePlugin(Object.assign({
            '$': 'jquery',
            'jQuery': 'jquery',
            'window.jQuery': 'jquery'
        }, dependency_loader.getPluginProvider())), // Wraps module with variable and injects wherever it's needed
        new ZipBundlePlugin() // Compile automatically zips
    ]
};
