const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'production',
    module:{
        rules: [
          {
            test: /\.(js|ts|jsx|tsx)/,
            use: {
                loader: 'babel-loader',
                options: {
                presets: [
                    '@babel/preset-env',
                    "@babel/preset-typescript",
                    "@babel/preset-react",
                ],
                },
            },
          },
          {
            test: /\.css$/,
            use: [
              {loader: 'style-loader'},
              {loader: 'css-loader'},
            ]
          },
          {
            test: /\.less$/,
            use: [
              {loader: 'style-loader'},
              {loader: 'css-loader'},
              {loader: 'less-loader'},
            ]
          },
          {
            test: /\.(sa|sc)ss$/,
            use: [
              {loader: 'style-loader'},
              {loader: 'css-loader'},
              {
                loader: "sass-loader",
                options: {
                  implementation: require("sass"),
                },
              },
            ]
          },
          {
            test: /\.(png|jpg|gif|eot|woff|ttf)$/,
            //inline 相当于 url-loader
            type: "asset/resource",
          },
          {
            test: /\.svg$/,
            issuer: /\.[jt]sx?$/,
            use: ["@svgr/webpack"],
            resourceQuery: { not: [/url/]},
            include: [
              /src/,
              /node_modules/
            ]
          },
          //使用 img src 引入的，svg 需要加 ?url
          {
            test: /\.svg$/,
            type: 'asset',
            resourceQuery: /url/, // *.svg?url
          },
        ]
    },
    plugins: [new HtmlWebpackPlugin({
        template: './public/index.html'
    })],
    performance: { // 关闭性能提示
        hints: false,
    }
}