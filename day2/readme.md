# 前端工程基础篇(2)-配置 webpack 加载器

在现代前端开发中，构建系统的配置是确保项目高效、可靠运行的关键。
本文将指导你如何为常见的前端文件格式配置webpack加载器。

前端常见文件格式如下

1. JS代码:  `js`、 `jsx`、 `ts`、`tsx`
2. 样式: `css`、`scss`、`less`
3. 图片: `jpg`、`jpeg`、`png`、`gif`、`bmp`、`svg`
4. 字体: `woff`、`woff2`、`ttf`、`otf`、`eot`
5. 数据存储: `json`、`xml`
6. 模板文件:  `tpl`
7. 二进制代码: `wasm`
8. 其他自定义后缀,比如 `.vue` 等

这些后缀名的文件如何打开是要告诉 `webpack`的，好比新装系统时候，需要装一系列软件告诉系统如何打开，比如压缩包`.rar`、视频`.mp4`,音频`.mp3` 等, 我们需要告诉系统如何打开这些文件。

## 为什么要编译

在开发过程中，我们通过文件系统编写业务逻辑，最终将多个代码模块打包成一个`main.js`文件和一个`HTML`文件。为了让浏览器能够渲染这些资源，我们需要对这些文件进行处理，可能是内联到`HTML`中，或者作为外部资源链接。这个过程通常被称为单页面应用（SPA）。


每种文件类型后缀的文件都需要处理，如何处理好这些后缀的资源文件，webpack 就学会一半了。

[webpack loader](https://webpack.docschina.org/loaders/) 有很多，官方文档有比较全面的解释。

下面我会列出在我们项目中，经过长期验证后总结的最佳实践配置。

## 修改项目配置，支持这些文件格式

### 解析JS代码

解析JS则需要用到 babel, [babel](https://github.com/babel/babel) 在2014年创建,作者塞巴斯蒂安是位97年的小伙。

有兴趣的可以了解一下[他的经历](https://medium.com/@sebmck/2015-in-review-51ac7035e272)

安装依赖：

```
yarn add babel-loader @babel/core

yarn add @babel/preset-env @babel/preset-typescript @babel/preset-react
```

`@babel/core` 是 babel的核心，转换JS代码用

`babel-loader` 和 webpack结合用的，webpack会在上下文把源码传入给babel转换。

`@babel/preset-env` 必选，是预设插件，简化了babel 配置，对代码会根据不同浏览器做出解释。

`@babel/preset-typescript` 可选，如果代码里面用了 ts,需要添加。

`@babel/preset-react` 可选，如果代码里面有react，需要添加。

编辑 `webpack.config.js`

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    module:{
      rules: [
        test: /\.(js｜ts|jsx|tsx)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env'
              "@babel/preset-typescript",
              "@babel/preset-react",
            ],
          },
        },
      ]
    },
    plugins: [new HtmlWebpackPlugin({
        template: './public/index.html'
    })]
}
```

### 解析样式



安装依赖：

```
yarn add style-loader css-loader -D
yarn add less-loader less -D
yarn add sass-loader sass -D

```

[less](https://less.bootcss.com/)和 [sass](https://sass-lang.com/) 二选一即可

编译样式的顺序是编译 .less  .scss 文件为正常的 css格式，
然后交给css-loader 进行编译，
最后交给 style-loader, 通过js 创建 style 标签，把结果插入到html当中。


当然也可以不用style-loader，使用 [MiniCssExtractPlugin](https://webpack.docschina.org/plugins/mini-css-extract-plugin#root) 把样式文件分离成单独文件，`MiniCssExtractPlugin` 唯一缺点就是在模块联邦的微前端结构下有问题。


```js
module.exports = {
    mode: 'development',
    module:{
        rules: [
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
        ]
    },
    ...
}
```

从上面的配置可以看到， loader 的加载顺序是从下到上，所以配置的时候要反着来。

### 解析图片等资源

webpack5 内置了资源模块的解析，不用再装一堆loader,配置如下

这里没有特殊的，比较简单，具体解释可以看官方文档的[资源模块章节](https://webpack.docschina.org/guides/asset-modules/#custom-output-filename)

```js
  module:{
    ...
    rules:[
        {
        test: /\.(png|jpg|gif|eot|woff|ttf)$/,
        type: "asset/resource",
       },
    ]
  }
```

### 解析SVG

其实 asset/resource 也可以解析svg，但是在React 下，处理svg 比较好的是另一个loader `@svgr/webpack`，会把SVG转成React 代码，会让React开发者更方便的处理参数和定制SVG。 [官方文档](https://react-svgr.com/docs/webpack/)

安装依赖

```
yarn add  @svgr/webpack -D
```

```js
  module:{
    ...
    rules:[
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
  }
```

上面是经过实践总结的一个最佳svg配置，既支持项目内的svg，又支持远程的svg.
对于项目内的svg文件，可以使用 `@svgr/webpack` 转成React使用，
而对于一些远程的 svg 文件，在运行时加载，不需要编译的，我们可以通过在路径上加自定义参数方式，和内联区分开。

至此，我们常用的文件类型全部处理完成，一个简单的前端项目结构就都能够支持了，是不是很简单。