#!/usr/bin/env node
// 指定解释器
// npm link

// 定制命令行界面
const program = require("commander")

// 版本kkb -V
program.version(require('../package.json').version)


program.command('init <name>')
    .description('init project')
    .action(
        // name为用户kkb init aaa   的aaa
        // console.log('init=>', name)
        require('../lib/init.js')
    )

// console.log("111")
program.parse(process.argv)