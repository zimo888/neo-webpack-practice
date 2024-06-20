//引入webpack 核心
const webpack = require('webpack');
//引入开发服务器框架
const WebpackDevServer = require('webpack-dev-server');
//引入webpack配置文件
const development = require('./webpack.development');
//初始化开发服务器
const server = new WebpackDevServer(development.devServer, webpack(development));
//启动开发服务
server.startCallback(() => {
  console.log('Successfully started server');
});