# 前端工程进阶篇(1)- 开发态的设置

前端代码会运行在不同环境下，比如本地开发环境控制台会多一些调试信息，生产环境则要去掉。
甚至会有一些定制客户环境。

Webpack 配置中的 mode 就是用来区分开发和生产环境的，通常我们会建两个文件区分开发环境和生产环境。


接下来就是几个 `webpack.development.js` 里面的最基本配置。

## 区分环境

这里我们还需要一个公共的模块作为共享配置，取名 `webpack.common.js`，我们把原来的 webpack.config.js 里面所有内容复制到这个文件。

然后新增 `webpack.development.js` 和 `webpack.production.js` 两个文件。

此时我们的配置变成这样：

`webpack.development.js`

```js
const common = require('./webpack.common')
module.exports = {
  ...common,
  mode: 'development',
}
```

`webpack.production.js`

```js
const common = require('./webpack.common')
module.exports = {
  ...common,
  mode: 'production',
}
```

但是三个点这种语法糖是对象浅合并，如果合并数组的时候，就会变成覆盖操作。

这里推荐一个更专业的webpack 合并工具 [webpack-merge](https://www.npmjs.com/package/webpack-merge)

webpack-merge 类库的 merge 方法基于 lodash 类库的 [mergeWith](https://www.lodashjs.com/docs/lodash.mergeWith) 方法实现。

安装

```shell
yarn add webpack-merge -D
```

## 新的写法：

开发环境:

`webpack.development.js`

```js
const common = require('./webpack.common')
const merge = require('webpack-merge');
module.exports = merge(common, {
  mode: 'development',
});
```

生产环境:

`webpack.production.js`

```js
const common = require('./webpack.common')
const merge = require('webpack-merge');
module.exports = merge(common, {
  mode: 'production',
});
```

这里还需要进一步继续优化一下,  node 提供了全局环境变量 `process.env`, 可以在程序中全局使用，帮助我们更灵活的区分环境。

修改 `package.json` 中的启动命令注入全局变量 `NODE_ENV` ，`NODE_ENV`是随便取的，你也可以任意取名字。 

```json
  "scripts": {
    "start": "NODE_ENV=development webpack serve --config webpack.development.js",
    "build": "NODE_ENV=production webpack --config webpack.production.js"
  },
```

修改 `webpack.common.js`

```js
module.exports = {
  mode: process.env.NODE_ENV
}

```

这次开发配置文件变成如下:

`webpack.development.js`

```js
const common = require('./webpack.common')
const webpackMerge = require('webpack-merge');
module.exports = webpackMerge.merge(common, {});
```

费这么大劲引入 `process.env.NODE_ENV` 不光为了配置文件能简单一些，还是为了我们能在项目文件中也能判断环境。

比如在生产环境关闭日志打印，可以在 `index.tsx` 顶部加下面的判断：
这样浏览器 console 面板里，打印的调试信息，就在生产环境下就看不到了。
```js
if(process.env.NODE_ENV === 'production'){
  console.log = () => {};
  console.debug = () => {};
  console.info = () => {};
  console.warn = () => {};
}
```

## [devServer](https://webpack.docschina.org/configuration/dev-server/)

先说怎么配:


`webpack.development.js`

```js
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
    }
});
```

`devServer` 最常用的配置就是改开发环境的端口和请求的代理。

[port:](https://webpack.docschina.org/configuration/dev-server/#devserverport) 改 port 防止端口占用。

[proxy:](https://webpack.docschina.org/configuration/dev-server/#devserverproxy) 拦截请求前缀，转发给后台服务器返回接口，  webpack 官网 proxy 有很多种写法，函数式的代理是我觉得写起来比较灵活的一种。


我的前端代码请求接口一般是这么写。

```js
 import axios from 'axios'
 axios.get('/api').then(resp=> resp);
 //或
 fetch('/rest').then(resp=>resp)
```


开发态的时候我们需要拼完整路径 `https://[服务器域名]/api` 才是正确请求, 直接在代码写完整请求的话浏览器又会产生跨域错误,所以只能借助 node 服务进行转发。


## 关闭优化

开发环境可以设置 `minimize` 为 `false` 防止代码压缩，减少编译时间。


```js
module.exports = {
 optimization: {
    minimize: false,
  }
}
```

## 设置 [source-map](https://webpack.docschina.org/configuration/devtool/#root)

sourcemap 设置了之后，在开发环境下就可以调试源码了。不然看到的都是编译后的代码。

```js
module.exports = {
 devtool: "source-map"
}

```

## 开启缓存 [cache](https://webpack.docschina.org/configuration/cache#cacheallowcollectingmemory)

缓存编译结果，第二次启动的时候，能够减少时间。缓存结果的目录默认在 `node_modules/.cache` 下

使用文档提供的默认配置即可。

```js
module.exports = {
  cache: {
    type: 'filesystem',
    allowCollectingMemory: true,
  },
};
```