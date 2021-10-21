中文官网：http://www.itying.com/koa

它要求 Node.js 版本高于 V7.6。因为 node.js 7.6 版本 开始完全支持 async/await，所以才能完全你支持我们的 Koa2。

```
npm install --save koa
```

### 开始

```js
var koa =require('koa');
var app=new koa();

//中间件

app.use( async (ctx)=>{
     ctx.body='你好 koa2.x';
})

app.listen(3000);
```

### get传值，动态路由

##### 路由

cnpm install --save koa-router

```js
var Koa=require('koa');

var Router = require('koa-router');

var app=new Koa();

var router = new Router();

// 引入实例化路由可以直接这样写
// var router = require('koa-router')();

//配置路由
router.get('/',async (ctx)=>{
    ctx.body='首页';
}).get('/news',async (ctx)=>{
    ctx.body="这是一个新闻页面"
})
//启动路由

app
    .use(router.routes())   /*启动路由*/
    .use(router.allowedMethods());


/*
 router.allowedMethods()作用：我们可以
 看到 router.allowedMethods()用在了路由匹配 router.routes()之后,所以在当所有
 路由中间件最后调用.此时根据 ctx.status 设置 response 响应头
*/
app.listen(3000);
```

##### get传值

```js
//获取get传值
//http://localhost:3002/newscontent?aid=123

router.get('/newscontent',async (ctx)=>{
    // 从ctx上下文中直接获取
    console.log(ctx.query);
    console.log(ctx.querystring);
    console.log(ctx.url);   //获取url地址
    //ctx里面的request里面获取get传值
    console.log(ctx.request.url);
    console.log(ctx.request.query);   //  { aid: '123', name: 'zhangsan' }  对象
    console.log(ctx.request.querystring);   //  aid=123&name=zhangsan
    ctx.body="新闻详情";
})
```

##### 动态路由

```js
//动态路由  http://localhost:3002/newscontent/xxxx
router.get('/newscontent/:aid',async (ctx)=>{
    //获取动态路由的传值
    console.log(ctx.params);  //{ aid: '456' }
    ctx.body="新闻详情";
})
//动态路由里面可以传入多个值
//http://localhost:3002/package/123/456

router.get('/package/:aid/:cid',async (ctx)=>{

    //获取动态路由的传值
    console.log(ctx.params);  //{ aid: '123', cid: '456' }
    ctx.body="新闻详情";
})
```



### koa中间件以及洋葱图执行流程

##### 应用级中间件

```js
//匹配任何路由  ，如果不写next，这个路由被匹配到了就不会继续向下匹配
/*
 app.use(async (ctx)=>{
    ctx.body='这是一个中间件';
 })
* */

/*匹配路由之前打印日期*/
app.use(async (ctx,next)=>{
    console.log(new Date());
    await next(); /*当前路由匹配完成以后继续向下匹配*/
})

router.get('/',async (ctx)=>{
    ctx.body="首页";
})
router.get('/news',async (ctx)=>{
    ctx.body="新闻列表页面";
})
```

##### 路由级中间件

```js
router.get('/',async (ctx)=>{
    ctx.body="首页";
})
// 匹配到news路由以后继续向下匹配路由
router.get('/news',async (ctx,next)=>{
    console.log('这是一个新闻1');
    await next();
})
```

##### 错误处理中间件

```js
//匹配任何路由  ，如果不写next，这个路由被匹配到了就不会继续向下匹配
app.use(async (ctx,next)=>{
    console.log('这是一个中间件01');
    next();
    if(ctx.status==404){   /*如果页面找不到*/
        ctx.status = 404;
        ctx.body="这是一个 404 页面"
    }else{
        console.log(ctx.url);
    }
})

router.get('/',async (ctx)=>{
    ctx.body="首页";
})
```

##### 中间件的执行顺序

```js
app.use(async (ctx,next)=>{
    console.log('1、这是第一个中间件01');
    await next();
    console.log('5、匹配路由完成以后又会返回来执行中间件');
})

app.use(async (ctx,next)=>{
    console.log('2、这是第二个中间件02');
    await next();
    console.log('4、匹配路由完成以后又会返回来执行中间件');
})

router.get('/news',async (ctx)=>{
    console.log('3、匹配到了news这个路由');
    ctx.body='这是一个新闻';
})
```



### ejs模板引擎的使用



    1.npm install koa-views  --save
    2.npm install ejs  --save


    3.var views = require('koa-views');
    
    app.use(views(__dirname, { extension: 'ejs' }))   //模板的后缀名是ejs


```js
4 await ctx.render('index');
```

每一个路由的render里面都要渲染一个公共的数据

公共的数据放在这个里面，这样的话在模板的任何地方都可以使用

```js
ctx.state = {   //放在中间件
    session: this.session,
    title: 'app'
};
```



##### 配置模板引擎中间件  --第三方中间件

```js
app.use(views('views',{
    extension:'ejs'  /*应用ejs模板引擎*/
}))
//写一个中间件配置 公共的信息
app.use(async (ctx,next)=>{
    
    ctx.state.userinfo='张三';
    
    await next();/*继续向下匹配路由*/
})

router.get('/',async (ctx)=>{
   let title="你好ejs";
   await ctx.render('index',{
        title:title
    });
})

router.get('/news',async (ctx)=>{
    let list=['11111','22222','33333'];
    let content="<h2>这是一个h2</h2>";
    let num=12;
    
    await ctx.render('news',{
        list:list,
        content:content,
        num:num
    })
})
```

new.ejs

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title></title>
</head>
<body>

<% include public/header.ejs%>

<h2>ejs循环数据---<%=userinfo%></h2>

<ul>
    <%for(var i=0;i<list.length;i++){%>
        <li><%=list[i]%></li>
    <%}%>
</ul>

<h2>绑定html数据</h2>
<br/>
<%=content%>
<br/>
<%-content%>
<br/>
<br/>

<h2>条件判断</h2>
<br/>
<%if(num>24){%>

 大于24
<%}else{%>

小于24

<%}%>
<br/>
<br/>
</body>
</html>
```



index.ejs

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title></title>
</head>
<body>


<!-- 注意这里的引用 -->
<% include public/header.ejs%>
这是一个ejs的模板引擎

<h2><%=title%>-----<%=userinfo%></h2>



</body>
</html>
```



##### 文件路径

![image-20211021130858740](C:\Users\HDR\AppData\Roaming\Typora\typora-user-images\image-20211021130858740.png)



### post数据处理   koa-bodyparser中间件



    1. npm install --save koa-bodyparser
    2. var bodyParser = require('koa-bodyparser');
    3. app.use(bodyParser());
    4. ctx.request.body;  获取表单提交的数据

##### 代码

```js
var Koa=require('koa'),
    router = require('koa-router')(),
    views = require('koa-views'),
    bodyParser = require('koa-bodyparser');
var app=new Koa();

//配置post bodyparser的中间件
app.use(bodyParser());

//接收post提交的数据
router.post('/doAdd',async (ctx)=>{
    console.log(ctx.request.body);
    ctx.body=ctx.request.body;  //获取表单提交的数据
})

app.use(router.routes());   /*启动路由*/
app.use(router.allowedMethods());
app.listen(3000);
```



### 静态资源中间件 koa-static

```js
1.cnpm install  koa-static --save

2.const static = require('koa-static')

3.配置中间件
 app.use(static('static'))
```

代码

```js
var Koa=require('koa'),
    static = require('koa-static');

var app=new Koa();

// http://localhost:3000/css/basic.css  首先去static目录找 ，如果能找到返回对应的文件，找不到 next()

//配置静态web服务的中间件
//app.use(static('./static'));

app.use(static(__dirname+'/static'));

app.use(static(__dirname+'/public'));   // koa静态资源中间件可以配置多个
```

![image-20211021132331271](C:\Users\HDR\AppData\Roaming\Typora\typora-user-images\image-20211021132331271.png)



### art-template高性能模板引擎

```js
1、
 npm install --save art-template    //  or
 npm install --save koa-art-template
2、const render = require('koa-art-template');
3、
 render(app, {
     root: path.join(__dirname, 'view'),   视图的位置
     extname: '.art', 后缀名
     debug: process.env.NODE_ENV !== 'production'  是否开启调试模式
 });
4、await ctx.render('user');
```

##### 实例

```js
var Koa=require('koa'),
    router = require('koa-router')(),
    render = require('koa-art-template'),
    path=require('path');

var app=new Koa();

//配置 koa-art-template模板引擎
render(app, {
    root: path.join(__dirname, 'views'),
    extname: '.html',
    debug: process.env.NODE_ENV !== 'production'
});

router.get('/',async (ctx)=>{
    let list={
        name:'张三',
        h:'<h2>这是一个h2</h2>',
        num:20,
        data:['11111111','2222222222','33333333333']
    }
    await ctx.render('index',{
        list:list
    });
})


app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3000);
```

![image-20211021132745860](C:\Users\HDR\AppData\Roaming\Typora\typora-user-images\image-20211021132745860.png)



### cookie   koa中使用

```js
router.get('/about',async (ctx)=>{
    // 11111
    ctx.cookies.set('userinfo','zhangsan33333',{
        maxAge:60*1000*60,
        path:'/news',
        httpOnly:false,  //true表示这个cookie只有服务器端可以访问
        domain:'.baidu.com'  /*正常情况不要设置 默认就是当前域下面的所有页面都可以方法*/

    });
    ctx.body="这是关于我们";
})

router.get('/news',async (ctx)=>{
    // 222222
    var userinfo=ctx.cookies.get('userinfo');
    console.log(userinfo);
    let app={
        name:'张三11'
    };
    await ctx.render('news',{
        list:app
    });
})
```

#### koa中没法直接设置中文的cookie

```js
router.get('/',async (ctx)=>{
    var userinfo=new Buffer('张三').toString('base64');
    
     ctx.cookies.set('userinfo',userinfo,{
        maxAge:60*1000*60
     });
    let list={
        name:'张三'
    }
    await ctx.render('index',{
        list:list
    });
})


router.get('/news',async (ctx)=>{
    var data=ctx.cookies.get('userinfo');
    var userinfo=new Buffer(data, 'base64').toString();
    let app={
        name:'张三11'
    };
    await ctx.render('news',{
        list:app
    });
})
```



### session   koa中使用

```
npm install koa-session  --save
```

```js
// 配置
const session = require('koa-session');

app.keys = ['some secret hurr'];

const CONFIG = {
 	key: 'koa:sess',
	maxAge: 86400000,
    overwrite: true, 
    httpOnly: true,
    signed: true,  // 默认 签名
    rolling: true,  // 在每次请求时强行设置 cookie，这将重置 cookie 过期时间.默认： false
    renew: false  // renew session when session is nearly expired
};
app.use(session(CONFIG, app));

// 设置 session
ctx.session.username = "张三"

// 获取 session
ctx.session.username
```



### koa路由模块化

##### app.js

```js

const Koa=require('koa'),
     router=require('koa-router')();
//引入子模块
var admin=require('./routes/admin.js');
var api=require('./routes/api.js');

var app=new Koa();

//配置路由
router.get('/',(ctx)=>{
    ctx.body='这是一个首页'
})


// 注意下面模块的引入方式与暴露方式

 //  admin   配置子路由  层级路由   admin/user
router.use('/admin', admin.routes());

//       /api/newslist   新闻列表的api
router.use('/api', api);   /*在模块里面暴露路由并且启动路由*/

//启动路由
app.use(router.routes()).use(router.allowedMethods());

app.listen(8008);
```

##### api.js

```js
var router=require('koa-router')();

router.get('/',(ctx)=>{
    ctx.body={"title":"这是一个api"};
})

router.get('/newslist',(ctx)=>{
    ctx.body={"title":"这是一个新闻接口"};
})

router.get('/focus',(ctx)=>{
    ctx.body={"title":"这是一个轮播图的api"};
})

module.exports=router.routes();
```

##### admin.js

```js
var router=require('koa-router')();

router.get('/',(ctx)=>{
    ctx.body='后台管理系统首页'
})

router.get('/user',(ctx)=>{
    ctx.body='用户管理'
})

router.get('/focus',(ctx)=>{
    ctx.body='轮播图管理'
})

router.get('/news',(ctx)=>{
    ctx.body='新闻管理'
})

module.exports=router;
```

![image-20211021135214700](C:\Users\HDR\AppData\Roaming\Typora\typora-user-images\image-20211021135214700.png)



### koa脚手架创建项目

```js
npm i -g koa-generator

koa2 -e myapp   // 创建koa2 的项目
cd myapp
npm i 

npm run start
```

![image-20211021135849141](C:\Users\HDR\AppData\Roaming\Typora\typora-user-images\image-20211021135849141.png)