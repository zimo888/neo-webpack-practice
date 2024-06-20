#!/usr/bin/env node
//前面两个系统路径不要，从数组第二个开始截取
const args = process.argv.slice(2);

//解析参数，获取当前命令
function parseArgs(args) {
    const result  = {
        start: false,
        build: false,
        help: false
    }
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        switch (arg) {
            case 'start':
                result.start = true;
                break;
            case 'build':
                result.build = true;
                break;
            case '--help':
                result.help = true;
                break;
            default:
                break;
        }
    }
    return result
}

function usage(){
    console.log(`
    zimopack <选项>
    选项:
        start       启动命令
        build       构建命令
        help        帮助命令
    `)
}


const argv = parseArgs(args);

//没有传参数的时候，显示帮助文本
if(args.length === 0){
    usage();
    return;
}

if(argv.start){
    console.log('启动项目')
    require('./build_dev');
}else if(argv.build){
    console.log('打包项目');
    require('./build_dev');
}else{
    console.log('没有传参数');
    usage();
}




