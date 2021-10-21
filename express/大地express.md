# express

### 基本配置以及get传值

```js
const express = require('express')
const app=express()

app.get("/",(req,res)=>{
    res.send("你好 express")
})

app.get("/login",(req,res)=>{
    res.send("登录")
})

app.post("/doLogin",(req,res)=>{   //post:增加数据
    console.log("执行登录")
    res.send("执行登录")
})

app.put("/editUser",(req,res)=>{  //put：主要用于修改数据
    console.log("修改用户")
    res.send("修改用户")
})

app.delete("/deleteUser",(req,res)=>{  //delete：主要用于删除数据
    console.log("执行删除")
    res.send("执行删除")
})

//路由里面配置多级目录  http://localhost:3000/admin/user/edit
app.get("/admin/user/add",(req,res)=>{
    res.send("admin user add")
})

//动态路由  配置路由的时候也要注意顺序
app.get("/article/add",(req,res)=>{
    res.send("article add")
})

app.get("/article/:id",(req,res)=>{
    var id=req.params["id"]    //获取动态路由
    res.send("动态路由"+id)
})

//get 传值  http://localhost:3000/product?id=123&cid=123
app.get("/product",(req,res)=>{
    let query = req.query   //获取get传值
    console.log(query)
    res.send("product-"+query.id)
})

app.listen(3000)
```

### 使用ejs

![image-20211021152619440](C:\Users\HDR\AppData\Roaming\Typora\typora-user-images\image-20211021152619440.png)

```js
/*
1、安装  cnpm install ejs --save
2、app.set("view engine","ejs")
3、使用  (默认加载模板引擎的文件夹是views)
    res.render("index",{

    })
*/


const express = require("express");
const app = express()
//配置模板引擎

app.set("view engine","ejs")


app.get("/",(req,res)=>{
    let title = "你好ejs";
    res.render("index",{
        title:title
    })
})

app.get("/news",(req,res)=>{
    let userinfo={
        username:"张三",
        age:20
    }
    let article="<h3>我是一个h3</h3>"

    let list=["1111","22222","3333333"]

    let newsList=[
        {
            title:"新闻1111",          
        },
        {
            title:"新闻122222",          
        },
        {
            title:"新闻33331",          
        },
        {
            title:"新闻44444",          
        }
    ]

    res.render("news",{
        userinfo:userinfo,
        article:article,
        flag:true,
        score:60,
        list:list,
        newsList:newsList
    })
})
//监听端口  端口号建议写成3000以上
app.listen(3000)
```

#### 静态文件托管

```js
/*
1.在 app.js 的头上定义 ejs:,代码如下: 

	var ejs = require('ejs'); 

2.注册 html 模板引擎代码如下： 

	app.engine('html',ejs.__express);

3.将模板引擎换成 html 代码如下:

	app.set('view engine', 'html'); 

4.修改模板文件的后缀为.html。
*/

const express = require("express");
const ejs = require("ejs");
const app = express()
//配置模板引擎
app.engine("html",ejs.__express)
app.set("view engine","html")

//配置静态web目录
app.use(express.static("static"))

app.get("/",(req,res)=>{
    let title = "你好ejs";
    res.render("index",{
        title:title
    })
})

app.get("/news",(req,res)=>{
    let userinfo={
        username:"张三",
        age:20
    }
    let article="<h3>我是一个h3</h3>"

    let list=["1111","22222","3333333"]

    let newsList=[
        {
            title:"新闻1111",          
        },
        {
            title:"新闻122222",          
        },
        {
            title:"新闻33331",          
        },
        {
            title:"新闻44444",          
        }
    ]

    res.render("news",{
        userinfo:userinfo,
        article:article,
        flag:true,
        score:60,
        list:list,
        newsList:newsList
    })
})
//监听端口  端口号建议写成3000以上
app.listen(3000)
```

### express中间件

![image-20211021185514186](C:\Users\HDR\AppData\Roaming\Typora\typora-user-images\image-20211021185514186.png)

```js
const express = require("express");
const app = express()

//4、内置中间件
app.use(express.static("static"))

//1、应用级中间件 (用于权限判断)
app.use((req,res,next)=>{
    console.log(new Date())    
    next()
})


app.get("/login",(req,res)=>{
    res.send("执行登录")
})

//2、路由级中间件(用的比较少)
app.get("/news/add",(req,res,next)=>{
    // res.send("执行增加新闻")
    console.log("执行增加新闻")
    next()
})

app.get("/news/:id",(req,res)=>{
    res.send("新闻动态路由")
})

//3、错误处理中间件  /css/base.css
app.use((req,res,next)=>{
   res.status(404).send("404")
})

app.listen(3000)
```

### body-parser

```js
cnpm install body-parser --save

var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())
 // 接受post数据
req.body
```

```js
app.post("/doLogin",(req,res)=>{
   // req.body 获取post传值
   var body = req.body;
   console.log(body)
   res.send("执行提交"+body.username)
})
```

### cookie-parser

```js
const express = require('express')
const app=express()

const cookieParser = require('cookie-parser')
//配置cookieParser中间件
app.use(cookieParser("ityingaaa"))

app.get("/",(req,res)=>{  
    //设置cookie  如果cookie没有过期的话，关闭浏览器后重新打开,cookie不会销毁
    // res.cookie("username","zhangsan",{maxAge:1000*60*60})

    // res.cookie("username","zhangsan",{maxAge:1000*60*60,path:"/article"})

    //多个域名共享cookie  aaa.itying.com   bbb.itying.com 
    // res.cookie("username","zhangsan1111",{maxAge:1000*60*60,domain:".itying.com"})

    //中文cookie
    // res.cookie("username","张三",{maxAge:1000*60*60})


    /*
    

    */

    res.cookie("username","zhangsan",{maxAge:1000*60*60,signed:true})


    
    res.send("你好 express aaa")
})

app.get("/article",(req,res)=>{
    //获取cookie
    let username=req.cookies.username;
    console.log(username)
    res.send("新闻页面--"+username)
})

app.get("/user",(req,res)=>{
     //获取cookie
     let username=req.cookies.username;
     console.log(username)     
    res.send("用户--"+username)
})

app.get("/product",(req,res)=>{
    
    //获取加密的cookie
    let username=req.signedCookies.username  
    
   res.send("product--"+username)
})

app.listen(80)
```

##### 加密cookie

```js
cookie的加密   

    1、配置中间件的时候需要传入加密的参数
    	app.use(cookieParser("itying"))
    2、 	res.cookie("username","zhangsan",{maxAge:1000*60*60,signed:true})
    3、	req.signedCookies.username
```

### session基本使用

cnpm install express-session --save

```js
const express = require('express')
const session = require('express-session')
const app=express()
//配置session的中间件
app.use(session({
    secret: 'this is session', //服务器端生成 session 的签名
    name:"itying", //修改session对应cookie的名称
    resave: false, //强制保存 session 即使它并没有变化
    saveUninitialized: true, //强制将未初始化的 session 存储
    cookie: { 
        maxAge:1000*60*30,
        secure: false  // true 表示只有https协议才能访问cookie  
    },
    rolling:true  //在每次请求时强行设置 cookie，这将重置 cookie 过期时间（默认：false）
}))

app.get("/",(req,res)=>{
    //获取seesion
    if(req.session.username || req.session.age){
        res.send(req.session.username+"--"+req.session.age+"-已登录")        
    }else{
        res.send("没有登录")
    }
})

app.get("/login",(req,res)=>{  
    //设置seesion
    req.session.username="张三"
    req.session.age=20
    res.send("执行登录")
})

app.get("/loginOut",(req,res)=>{  
    // 清除cookie
    //1、设置session的过期时间为0  (它会把所有的session都销毁)
    // req.session.cookie.maxAge=0

    //2、销毁指定session
    // req.session.username=""

    //3、销毁session  destroy

    req.session.destroy()

    res.send("退出登录")
})
app.listen(3000)
```

### session多服务器的负载均衡

```js
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session);
const app=express()

//配置session的中间件
app.use(session({
    secret: 'this is session', //服务器端生成 session 的签名
    name:"itying", //修改session对应cookie的名称
    resave: false, //强制保存 session 即使它并没有变化
    saveUninitialized: true, //强制将未初始化的 session 存储
    cookie: { 
        maxAge:1000*60*30,
        secure: false
    },
    rolling:true,
    store: new MongoStore({
        url: 'mongodb://127.0.0.1:27017/shop',      
        touchAfter: 24 * 3600 // 不管发出了多少请求 在24小时内只更新一次session， 除非你改变了这个session 
    })
}))

app.get("/",(req,res)=>{
    //获取seesion
    if(req.session.username || req.session.age){
        res.send(req.session.username+"--"+req.session.age+"-已登录")        
    }else{
        res.send("没有登录")
    }
})

app.get("/login",(req,res)=>{  
    //设置seesion
    req.session.username="张三"
    req.session.age=20
    res.send("执行登录")
})

app.get("/loginOut",(req,res)=>{  
    //1、设置session的过期时间为0  (它会把所有的session都销毁)
    // req.session.cookie.maxAge=0

    //2、销毁指定session
    // req.session.username=""

    //3、销毁session  destroy

    req.session.destroy()

    res.send("退出登录")
})
app.listen(3000)
```

### 路由模块化

![image-20211021191125935](C:\Users\HDR\AppData\Roaming\Typora\typora-user-images\image-20211021191125935.png)

![image-20211021191420359](C:\Users\HDR\AppData\Roaming\Typora\typora-user-images\image-20211021191420359.png)

##### app.js

```js
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
```

##### routes/login.js

```js
const express = require("express");

var router = express.Router()

router.get("/",(req,res)=>{
    // req.query 获取get传值
    res.render("login",{})
 })
 
router.post("/doLogin",(req,res)=>{
    // req.body 获取post传值
    var body = req.body;
    console.log(body)
    res.send("执行提交"+body.username)
 })

 module.exports = router
```

##### login.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="/css/base.css">
</head>
<body>
  <h2>post提交数据</h2>

  <form action="/login/doLogin" method="post">
    用户名: <input type="text" name="username" /> <br> <br>
    密码: <input type="password" name="password" /><br> <br>

    <input type="submit" value="提交">
</form>
</body>
</html>
```

### multer文件上传

34，35



### express应用生成器

npx express-generator

 cnpm install -g express-generator

express --view=ejs express09