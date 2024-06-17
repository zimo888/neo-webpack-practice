const common = require('./webpack.common')
const webpackMerge = require('webpack-merge');
module.exports = webpackMerge.merge(common, {
    devServer: {
        open: true,
        port: 3300,
        proxy: [{
            context: function (pathname, req) {
                //请求路径里含这些前缀的，都进行转发
                return  ['/api','/rest'].some(prefix => pathname.indexOf(prefix) > -1);
            },
            //转发到目标域名,现在随便写一个
            target: 'https://localhost:3000',
        }]
    },
    optimization: {
      minimize: false,
    },
    devtool: "source-map",
    cache: {
      type: 'filesystem',
      allowCollectingMemory: true,
    },
});