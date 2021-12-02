const fs = require('fs')


function get(key){
    fs.readFile('./db.json', (err, data) => {
        const json = JSON.parse(data)

        console.log(json[key])
    })
}


function set(key, value) {
    fs.readFile('./db.json', (err, data) => {
        const json = data ? JSON.stringify(data): {};
        json[key] = value
        fs.writeFile('./db.json', JSON.stringify(json), err => {
            if(err){
                console.log(err)
            }

            console.log("okk")
        })
    })
}


// 命令行接口
// set a 1
// get a

const readline = require('readline')

// 相当于一个闸门
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})


// 监听命令行的一行
rl.on('line', function(input) {
    // 输入的命令
    const [op, key, value] = input.split(' ')

    if(op == "get") {
        get(key)
    }else if(op === "set"){
        set(key.value)
    }else if(op === "quit"){
        rl.close()
    }else {
        console.log('没有这个操作')
    }
})


rl.on('close', function(){
    console.log('程序结束')
    process.exit(0)
})