const webpack = require('webpack')
const production = require('./webpack.production');
// 执行构建
webpack(production, (err, stats) => {
  if (stats?.hasErrors()) {
    // 构建过程出错
    console.log(stats.compilation.getErrors())
  }
    // 成功执行完构建
});