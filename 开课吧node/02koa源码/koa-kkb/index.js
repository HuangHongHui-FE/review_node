// const koa = require('koa')
// const app = new koa()

// app.use(async (ctx, next)=> {
//     const start = Date.now()
//     await next()
//     const end = Date.now()
//     console.log(`请求${ctx.url} 耗时${parseInt(end - start)}ms`)
// })


// app.use((ctx, next) => {
//     ctx.body = [{
//         name: 'tom'
//     }]
// })

// app.listen(3000, () => {
//     console.log("koa start 3000!")
// })




const KKB = require('./kkb.js')
const app = new KKB()

// 这个实现了
// app.use((req, res) => {
//     res.writeHead(200)
//     res.end("666")
// })

app.use(ctx => {
    ctx.body = "hhaha"
})

app.listen(3000, ()=> {
    console.log("koa start 3000!")
})

