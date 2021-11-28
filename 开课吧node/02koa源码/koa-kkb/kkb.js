const http = require('http')

const context = require('./context.js')
const request = require('./request.js')
const response = require('./response.js')

// 实现new   app.use     app.listen
class KKB {
    listen(...args) {
        const server = http.createServer((req, res) =>{
            // this.callback(req, res)


            // 创建上下文
            const ctx = this.createContext(req, res)

            this.callback(ctx)
            // 响应

            res.end(ctx.body)
        })
        server.listen(...args)
    }

    use(callback) {
        this.callback = callback
    }

    createContext(req, res) {
        const ctx = Object.create(context)
        ctx.request = Object.create(request)
        ctx.response = Object.create(response)

        ctx.req = ctx.request.req = req
        ctx.res = ctx.response.res = res

        return ctx;

    }
}

module.exports = KKB