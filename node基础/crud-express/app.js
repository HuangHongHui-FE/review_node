/*
   app.js 是入门模块
   职责：
       创建服务
       做一些服务的相关配置
           模板引擎
           body-parser 解析表单post请求体
           提供静态资源服务
       挂载路由
       监听端口启动服务
*/


var express = require('express')
var router = require('./router')  // 路由分发
var bodyParser = require('body-parser')  // 用来获取提交的表单数据

var fs = require('fs')  // 用来文件读取
var app = express()

app.use('/node_modules/', express.static('./node_modules/'))
app.use('/public/', express.static('./public/'))

/*为了获取表单数据*/
// 配置模板引擎和body-parser要在app.use(router)挂载路由之前
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())



// 第一个参数，当渲染以.html结尾的文件时，使用art-template模板引擎
app.engine('html', require('express-art-template'))

// 把路由挂载到app 服务器中
app.use(router)


app.listen(3000, function() {
    console.log('running ... 3000')
})


