var webpack = require('webpack');

module.exports = {
    devtool: 'source-map',
    entry: [
        'webpack-dev-server/client?http://localhost:8080', // WebpackDevServer host and port
        'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
        'bootstrap-loader', //Loads Twitter Bootstrap
        './index.jsx' // Appʼs entry point
    ],
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'react-hot-loader!babel-loader?presets[]=es2015,presets[]=react',
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
                loader: 'file-loader' },/*
            {
                test: require.resolve('jquery'),
                loader: 'expose?jQuery!expose?$!expose?window.jQuery'  //expose-loader, exposes as global variable
            }*/
            {
                test: require.resolve('jszip'),
                loader: 'expose?JSZip'
            },
            {
                test: require.resolve('jszip-utils'),
                loader: 'expose?JSZipUtils'
            },
            {
                test: require.resolve('file-saver'),
                loader: 'expose?FileSaver'
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    output: {
        path: __dirname + '/dist',
        publicPath: '/', //This is used to generate URLs to e.g. images
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: './dist',
        hot: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        /*new webpack.ProvidePlugin({
            '$': 'jquery',
            'jQuery': 'jquery',
            'window.jQuery': 'jquery'
        })*/
        /*new webpack.ProvidePlugin({
            'JSZip': 'jszip',
            'JSZipUtils': 'jszip-utils'
        })*/
    ]
};