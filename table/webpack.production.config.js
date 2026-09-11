var webpack = require("webpack");
var path = require("path");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
    mode: 'production',
    devtool: false,
    entry: __dirname + "/app/app.js",
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
        clean: true
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
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            modules: true
                        }
                    }, {
                        loader: 'postcss-loader'
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
        new webpack.BannerPlugin("yhyh copyRight"),
        new HtmlWebpackPlugin({
            template: __dirname + "/app/index.tmpl.html" //new 一个这个插件的实例，并传入相关的参数
        }),
        new MiniCssExtractPlugin({ filename: "style.css" })
    ]
};
