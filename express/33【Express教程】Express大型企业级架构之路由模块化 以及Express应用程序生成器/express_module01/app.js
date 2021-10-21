const express = require("express");
const bodyParser = require('body-parser')
const ejs = require("ejs");
const app = express()
//引入外部模块
const login = require("./routes/login")

//配置模板引擎
app.engine("html",ejs.__express)
app.set("view engine","html")
//配置静态web目录
app.use(express.static("static"))
//配置第三方中间件
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//挂载login模块
app.use("/login",login)

app.get("/",(req,res)=>{
    res.send("首页")
})

//监听端口  端口号建议写成3000以上
app.listen(3000)