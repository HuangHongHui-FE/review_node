const {promisify} = require('util')

const figlet = promisify(require("figlet"))

const chalk = require('chalk')
// import chalk from 'chalk';
const clear = require('clear')

// 封装以下log打印的函数
const log = content => console.log(chalk.green(content))
// 下载的
const { clone } = require('clone')

// 输出流可以引入主进程输出流(为了能看到下载的过程)
const spawn = async (...args) => {
    const {spawn} = require('child_process')
    return new Promise(resolve => {
        const proc = spawn(...args)

        // 输出子进程的流连接到主进程上，流的对接
        proc.stdout.pipe(process.stdout)
        // 错误的话也要
        proc.stderr.pipe(process.stderr)
        // 完成了返回执行契约
        proc.on('close', () => {
            resolve()
        })
    })
}

// 打开浏览器的
const open = require('open')


module.exports = async name => {
    // 打印欢迎界面
    clear()
    const data = await figlet("KKB Welcome!")
    log(data)

    // 下载项目
    log('🚀创建项目' + name)
    // await clone('github:su37josephxia/vue-template', name)

    // 安装依赖
    // npm i
    log('安装依赖.....')

    // 操作他在命令行命令， 第三个参数配置在哪个目录下执行, 不同的window,与mac需要配置
    // await spawn('npm', ['install'], {cwd: `./${name}`})

    open('http://localhost:8000')

    // await spawn('npm', ['run', 'serve'], { cwd: `./${name}` })

}