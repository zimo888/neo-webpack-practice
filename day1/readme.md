## 从零徒手创建Webpack 项目

徒手创建工程是每个前端走深入了解工程的必经之路。

Hello World

1. 在空白文件夹下执行 `yarn init` , 输入项目名称后,命令行提示不用再看，一路回车,会创建出 `package.json`文件

2. 编辑 `package.json` 增加必要webpack 的依赖和启动构建命令

```json
{
  "name": "webpack-demo",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "scripts": {
    "start": "webpack serve --config webpack.config.js",
    "build": "webpack --config webpack.config.js"
  },
  "devDependencies": {
    "webpack":"^5.74.0",
    "webpack-cli":"^5.1.4",
    "webpack-dev-server":"^5.0.4",
    "html-webpack-plugin": "^5.6.0"
  }
}
```

`webpack`: 模块打包器，核心代码。
`webpack-cli`: Webpack的命令行接口，开发者可以通过命令行来运行Webpack和配置打包过程。
`webpack-dev-server`: 一个轻量级的开发服务器，支持实时重新加载（hot module replacement）和其它开发时功能，用于加快开发流程。执行 `yarn start` 调试的时候必须用到。
`html-webpack-plugin`: 一个Webpack插件，自动生成HTML文件，将打包后的bundle嵌入其中，方便浏览器加载。

3. 编写基础项目代码

创建public文件夹，然后创建index.html

```html
<html>
    <body>
        <div id="root"></div>
    </body>
</html>

```

创建src 文件夹，然后创建 index.js

用JS创建个HelloWorld，并挂载到html上面 id为 root 的 div 上

```js
console.log('hello world');
let div = document.createElement('div')
div.innerHTML = 'hello world'
document.getElementById('root').appendChild(div)
```

4. 根目录下创建 `webpack.config.js`

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    plugins: [new HtmlWebpackPlugin({
        template: './public/index.html'
    })]
}
```

5. 启动项目查看 `yarn && yarn start`

恭喜你，你已经完成了前端脚手架的初始化，就是这么简单。