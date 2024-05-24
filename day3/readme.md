# 前端工程基础篇(3)-打包配置

开发完成后，我们如果需要发布到线上的话，还需要完成打包相关配置。

打包配置的最简配置也不复杂，官方文档是比较全的，适用不同场景，缺点就是看着乱。

`webpack` 打包过程如下：

1. 定义入口点: 我们要告诉 `webpack` 项目的入口文件在哪里。
2. 依赖解析: `webpack` 会分析入口文件里面所有的导入语法，并递归地解析它们所依赖的其他模块。
3. 加载器: 通过各种 `loader` 解释器处理非 JavaScript 文件，将其转换为模块并添加到依赖图中。
4. 插件: `webpack` 提供生命周期扩展并加载插件，用于执行各种任务，如优化、资源管理和环境变量注入等。
5. 打包: 将处理后的模块打包成文件（通常是 `.js`, `.css`, `.html` 等），并输出到指定目录.
7. 优化-代码分割(如果需要): 大型应用程序通常会被分割成不同的代码块`（chunks）`，可以按需加载，以优化加载时间。
8. 完成打包: 最后，`webpack` 生成一个或多个打包后的文件，用于在浏览器中运行项目。

我们按步骤修改配置

## 1. 定义入口

继续修改 `webpack.config.js` , 增加一个`entry`即可， `main`指的是打包后输出时候的名字，可以任意写。

```js 
module.exports = {
    mode: 'production',
    entry:{
        main: './src/index.tsx'
    }
}
```

## 2. 依赖解析

解析的配置叫做 `resolve`, 详细内容请查看[官方文档](https://webpack.docschina.org/configuration/resolve/)

我们最常用的是 `alias` 别名。
webpack 解析依赖的时候，我们可以通过该配置替换一些模块。
配置如下：

### 别名

通过 `alias` 配置，比如定义一个 `@src` 的路径，`value` 则是一个绝对路径，
这样代码里面就可以直接通过 `import moduleName from '@src/xxx' ` 引入模块，而不用再通过文件夹查找相对位置了。

用`path.resolve`包装一下路径，生成兼容不同环境下的路径， 比如windows 的路径是 `\` ,linux 是 `/`

`__dirname` 指的是当前文件所在路径

另外还有

`process.cwd()` 指的是在哪个文件夹执行的命令，返回哪个路径。



```js

const path = require('path')
module.exports = {
   resolve:{
     alias: {
        '@src': path.resolve(__dirname, './src')
    }   
   }
}

```

还一种写法是精准匹配,就是 key上加个 `$`

```js

const path = require('path')
module.exports = {
   resolve:{
     alias: {
        'xyz$': path.resolve(__dirname, './xyz')
    }   
   }
}

```

意思是路径上只有以 comp 结尾的才会替换

```js
import Test1 from 'xyz'; // 这种写法 xyz 是结尾所以会被替换
import Test2 from 'xyz/file.js'; // 这种后面还有 /file 字符串，不会被替换
```

## 3. 加载器

在第二章节已经描述，不再赘述。

## 4. 插件

webpack 提供了扩展，可以让我们在它生命周期内编写代码，进行干预，社区里丰富的插件让它生态如此繁荣。 [官方文档](https://webpack.docschina.org/plugins/#root)


插件的配置是 `plugins`

### 进度条插件 [webpackbar](https://www.npmjs.com/package/webpackbar)

最好加上，默认的太丑，看不到文件执行过程。

```js
const WebpackBar = require("webpackbar");
module.exports = {
   plugins:[
        new WebpackBar(),
   ]
}

```


## CSS 抽取插件 [MiniCssExtractPlugin](https://webpack.docschina.org/plugins/mini-css-extract-plugin/)

可选,我们也可以通过 style-loader 把css 做成标签植入到html，在第二章节有讲述。

通过该插件把代码里面的 css 抽成文件

```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
   plugins:[        
        new MiniCssExtractPlugin({
            ignoreOrder: true,
            filename: "static/css/[name].css",
            chunkFilename: 'static/css/[name].css'
        })
   ]
}

```

## HTML 生成插件 [HtmlWebpackPlugin](https://webpack.docschina.org/plugins/html-webpack-plugin/)

必选，没有这个插件，就没有首页html，

特殊不用该插件的情况：
1. 该项目是组件库
2. 该项目首页由服务器端生成。

```js
module.exports = {
    plugins:[
         new HtmlWebpackPlugin({
            template: path.resolve(__dirname,'./public/index.html'),
            inject: 'body'
        }),
    ]
}
```



### 全局导入插件 [ProvidePlugin](https://webpack.docschina.org/plugins/provide-plugin/)

慎用，可能会导致冗余导入，写这个是因为很常见。
我们也只是在 jQuery 项目改造时候不得已才使用注入的。

该插件效果是，在代码中不用写 import 语句，直接用。
其实就是webpack会在每个模块前自动导入/


```js
new webpack.ProvidePlugin({
      _: "lodash"
}),
```

加插件之前

```js
 const _ = require('lodash');
 _.get()
```

加插件之后

```js
 _.get()
```


## 5. 打包

[官方文档](https://webpack.docschina.org/concepts/output/#root)

打包就是输出，是webpack构建的最后一步，配置完打包这一步，我们项目就可以发布了。 


```js
const path = require('path')
module.exports=  {
      output: {
        path: path.resolve( __dirname,"./build"),
        filename:  "static/js/[name].[chunkhash:8].js",
        publicPath: '/',
        assetModuleFilename: 'static/images/[name].[hash][ext][query]'
    },
}
```

我们至少需要配置

`path`: 构建产物的路径

`filename`: 所有 js 文件的名称规则和路径, 一般是名称加上一个随机串。

`publicPath`: 资源的前缀域名是什么，如果是 `/` 代表根域名下, 默认写 `/` 就行， 关于publicPath 有更复杂的配置，这里先不做介绍,到高级篇章的时候再详细解释。

有兴趣可以先看看

[静态PublicPath](https://webpack.docschina.org/configuration/output/#outputpublicpath)

[动态PublicPath](https://webpack.docschina.org/concepts/module-federation/#dynamicpublicpath)

这里面有几个知识点:

webpack  构建过程产生的是块 `chunk`, 有可嫩是 js, css,图片等，这些资源都叫块，可在构建过程中进行优化配置，比如合并、拆分、预加载等。

由于浏览器在请求时候会缓存资源，如果我们的资源不加随机串，更新过后，名字没变，浏览器优先取本地缓存，就不会更新。

但是如果加成时间戳这种实时更新的字符串，浏览器每次取资源就没有缓存了，也是不对的。


**webpack 生成chunk 的目的是保证唯一且缓存友好。**

1. [模板字符串](https://webpack.docschina.org/configuration/output/#template-strings)

路径 `static/js/[name].[chunkhash:8].js`中的 `[chunkhash:8]` 代表文件名里面的随机字符串，使用 `chunkhash` 算法取8位。

如果你希望即使一个chunk中的一部分模块发生变化，也能重新加载整个chunk，那么可以使用chunkhash。而如果你希望只有真正变化的模块重新加载，那么可以使用contenthash

A 代码里面引入了 B

chunkhash：  B 发生变化，A也需要变化，因为A引了B.

contenthash  B 发生变化，A不需要变化

到底选哪个这个需要对项目复杂度进行分析才能决定，求稳不出错选chunkhash。
求精准选contenthash。 我们项目选的是 `chunkhash`

2. `assetModuleFilename`

图片等资源的路径，必须使用了 webpack 自带的 [asset](https://webpack.docschina.org/guides/asset-modules/) loader 才能使用

如果你用了 file-loader 等三方的，需要在三方loader 的配置里写输出路径。

`[name].[hash][ext][query]` 这个规则代表名称 + 随机号+ 扩展名+查询

`query` 一般没有

举例
```
img1.f213.png?width=100
```

至此，你的一个简单的前端项目就可以正常打包上线了。

所有代码上传到: [Demo源码](https://github.com/zimo888/neo-webpack-practice)