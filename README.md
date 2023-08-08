# neo-webpack-practice

webpack 练习

通过徒手编写webpack配置，学习webpack内容，了解代码生成过程。

代码里都是半成品题目，需要自行配置webpack完成各class的要求。

## class1 Webpack 普通项目打包


练习目的:

熟悉webpack基本配置
熟悉babel基本配置
熟悉前端各种文件后缀，正确配置各种文件后缀的 loader。

练习要求：

0. 正确配置package.json 安装编译需要的依赖。
1. 使用最新版本的 React, Webpack, Babel 编译 class1 中的代码。
2. 配置各种loader 正确编译所有文件,正确配置webpack alias 
3. 输出产物到 build 文件夹
4. 编译时，区分开发环境，生产环境，开发环境文件名不带hash后缀，生产带hash
5. 开发环境正常启动，能够看到界面，开发端口3333。

# class2  打包成SDK

练习目的:

0. 熟悉 entry 常用的单入口和多入口两种用法。
1. 熟悉 output 常用配置： path、filename、library、libraryTarget、 publicPath、assetModuleFilename
   熟悉 动态publicPath 配置方式
2. 能够正确把项目打包成 sdk, 附带typescript

练习要求：

0. src/index.tsx 是entry
1. output的 path设置为 build,输出为class2 的 umd 模块。
2. 代码输出成一个文件。
3. 使用tsc 生成d.ts 类型文件。