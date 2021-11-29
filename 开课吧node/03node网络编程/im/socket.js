const net = require('net')

const chatServer = net.createServer()


const clientList = []


chatServer.on('connection', client => {
    // console.log(client)
    client.write('Welcome!\n')

    clientList.push(client)

    client.on('data', (data) => {
        // console.log('receive:', data.toString())

        // 广播每个用户都发一遍
        clientList.forEach(v => {
            v.write(data)
        })
    })
})

chatServer.listen('9000')