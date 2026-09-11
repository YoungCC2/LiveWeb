var webpack = require("webpack");
var path = require("path");
module.exports = {
    mode: 'development',
    devtool: 'eval-source-map',
    entry: __dirname + "/app/app.js",
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'bundle.js'
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'public')
        },
        historyApiFallback: true,
        port: 8080,
        host: '127.0.0.1',
        allowedHosts: 'auto'
    },
    module: {
        rules: [{
                test: /(\.jsx|\.js)$/,
                use: {
                    loader: "babel-loader"
                },
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [{
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader",
                        options: {
                            modules: true
                        }
                    }, {
                        loader: "postcss-loader"
                    }
                ]
            },
            {
                test: /\.less$/,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader"
                }, {
                    loader: "less-loader"
                }]
            },
            {
                test: /\.(png|jpg|gif)$/,
                type: 'asset',
                parser: {
                    dataUrlCondition: { maxSize: 102400 }
                }
            }
        ]
    },
    plugins: [
        new webpack.BannerPlugin("yhyh copyRight")
    ]
};
