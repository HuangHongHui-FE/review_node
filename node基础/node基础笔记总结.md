node基础笔记

### fs读取文件

成功

​      data 数据

​      error null

失败

​      data undefined没有数据

​      error 错误对象

```js
var fs = require('fs')
fs.readFile("./笔记.txt", function (error, data) {
    if (error) {
        console.log("读取文件失败")
    } else { 		         	          
        console.log(data.toString())
    }
})
```

### 写文件

成功：

  文件写入成功

  error 是 null

失败：

  文件写入失败

  error 是错误对象

```js
var fs = require('fs')
fs.writeFile('./配合03.txt', '大家好，给大家介绍一下，我是node.js', function (error) {
    // console.log('文件写入成功')
    if (error) {
        console.log('写入失败')
    } else {
        console.log('写入成功了')
    }
})
```

### http:createServer() 方法创建一个Web服务器

```js
var http = require('http')
// 返回一个Server实例
var server = http.createServer()

// request  请求事件处理函数，需要接收两个参数
server.on('request', function (request, response) {
    console.log("收到客户端请求了, 请求路径是：" + request.url)

    // write 可以使用多次，但是最后一定要用 end来结束响应
    response.write('hello')
    response.write(' Node.js')


    response.end()
})

server.listen(8888, function () {
    console.log("服务器启动成功了， 可以通过http://127.0.0.1:8888/来进行访问")
})

```

### http-url

```js
var http = require('http')
var server = http.createServer()

// 2. 监听 request 请求事件， 设置请求处理函数
server.on('request', function (req, res) {
    let url = req.url

    if (url === '/products') {
        var products = [
            {
                name: '苹果X',
                price: 8888
            },
            {
                name: '菠萝X',
                price: 5000
            },
            {
                name: '小辣椒X',
                price: 9999
            }
        ]
        // 响应内容只能是，二进制数据或者字符串（数字，对象，数组，布尔值均不可）
        // 将数组转化为字符串
        res.end(JSON.stringify(products))
    }
})

server.listen(3000, function () {
    console.log('服务器启动成功， 可以访问了。。。')
})
```

### 设置响应请求头content-type

```js
var http = require("http")
var server = http.createServer()
server.on('request', function (req, res) {
    // 服务端默认发送的数据，是utf-8编码的内容
    // 但是浏览器不知道，则会按照当前操作系统的编码去解析
    // 中文系统的编码默认为 gbk
    var url = req.url
    if (url === '/plain') {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8')  // 普通文本
        res.end('hello 世界')
    } else if (url === '/html') {
        res.setHeader('Content-Type', 'text/html; charset=utf-8')  // 告知浏览器为html类型
        res.end('<p>hello html <a href="#">点我</a></p>')
    }
})

server.listen(3000, function () {
    console.log('Server is running...')
})
```

### 设置响应请求头content-type2

##### 发送过去图片

```js
var http = require("http")
var fs = require("fs")
var server = http.createServer()

server.on('request', function (req, res) {
    var url = req.url
    // 要发送在文件中的内容
    if (url === '/') {
        fs.readFile('./resource/index.html', function (err, data) {
            if (err) {
                res.setHeader('Content-Type', 'text/plain; charset=utf-8')
                res.end("文件读取失败，请稍后重试！")
            } else {
                // res.end() 支持两种数据类型，一种是二进制，一种是字符串
                res.setHeader('Content-Type', 'text/html; charset=utf-8')
                res.end(data)
            }
        })
    } else if (url === '/body') {
        fs.readFile('./resource/main.png', function (err, data) {
            if (err) {
                res.setHeader('Content-Type', 'text/plain; charset=utf-8')
                res.end("文件读取失败，请稍后重试！")
            } else {
                // 图片不需要指定编码，编码指的是字符编码
                res.setHeader('Content-Type', 'image/jpeg')
                res.end(data)
            }
        })
    }
})
server.listen(3011, function () {
    console.log('Server is running...')
})
```

### 读取目录

```js
var fs = require('fs')

fs.readdir('./resource', function (err, files) {
    if (err) {
        return console.log('目录不存在')
    }
    console.log(files) // 结果为列表可切片
})
```

### art-template模板引擎

##### html文件里引入

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <!--强调： 模板引擎不关心你的字符串内容，只关心自己能认识的模板表标记法，例如{{}}, 被称为mustache语法-->
</head>
<body>
<script src="C:/Users/HDR/IdeaProjects/IDEA/nodejs/node/node_modules/art-template/lib/template-web.js"></script>
<script type="text/template" id="tpl">
    大家好，我叫 {{ name }}
    我今年 {{ age }} 岁了
    我喜欢 {{ each hobbies }} {{ $value }} {{ /each }}
</script>
    <script>
        var ret = template('tpl', {
            name: "jack",
            age: 18,
            hobbies: [
                '写代码',
                '唱歌',
                '打游戏'
            ]
        })
        console.log(ret)
    </script>

</body>
</html>
```

##### 在node里使用

11.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>
<body>

    <p>大家好，我叫 {{ name }}</p>
    <p>我今年 {{ age }} 岁了</p>
    {{ each hobbies }} 
    <p>我喜欢{{ $value }}</p>  
     {{ /each }}

</body>
</html>
```

```js
// http://aui.github.io/art-template/docs/index.html 官方文档

var template = require('art-template')
var fs = require('fs')

fs.readFile('./11.html', function (err, data) {
    if (err) {
        return console.log('读取文件夹失败')
    }
    
    // render需要的是字符串
    var ret = template.render(data.toString(), {
        name: "jack",
        age: 18,
        hobbies: [
            '写代码',
            '唱歌',
            '打游戏'
        ]
    })
    console.log(ret)
})

```

### 静态资源的处理

![image-20211028130905206](C:\Users\HDR\AppData\Roaming\Typora\typora-user-images\image-20211028130905206.png)

```js
// 为了让目录结构更加清晰，将html文件放在views目录中
// 为了方便处理静态资源，约定把所有静态资源放在public目录中
var http = require('http')

var fs = require('fs')
var template = require('art-template')

var comments = [
    {
        name: '张三0',
        message: '今天天气真不错0'
    },
    {
        name: '张三1',
        message: '今天天气真不错1'
    },
    {
        name: '张三2',
        message: '今天天气真不错2'
    },
    {
        name: '张三3',
        message: '今天天气真不错3'
    }
]

http.createServer(function (req, res) {
    var url = req.url
    if (url === '/') {
        fs.readFile('./views/pojie.html', function (err, data) {
            if (err) {
                return res.end('404 not Found')
            }
            var htmlStr = template.render(data.toString(), {
                comments: comments
            })
            res.end(htmlStr)
        })
    } else if (url.indexOf('/static/') === 0) {
        //    如果路径是以/static/开头的则要获取static中的资源
        fs.readFile('.' + url, function (err, data) {
            if (err) {
                return res.end('404 Not Found')
            }
            res.end(data)
        })
    } else {
        // 其他找不到的处理成404
        fs.readFile('./views/404.html', function (err, data) {
            if (err) {
                return res.end('404 Not Found')
            }
            res.end(data)
        })
    }
}).listen(3000, function () {
    console.log('running...')
})
```

### url模块

```js
var url = require('url')

var obj = url.parse('/pinglun?name=的得得&message=的得得', true)
// 使用url.parse方法将路径解析为一个方便操作的对象，true:直接将查搜字符串转化为一个对象
console.log(obj)
console.log(obj.query)
console.log(obj.pathname)


// 如何通过服务器让客户端重定向
//      1. 状态码设置为302临时重定向
//      2. 在响应头中通过location告诉客户端往哪重定向
// 如果客户端发现收到服务器的状态码是302就会自动去响应头中找location,然后对该地址发送新的请求， 就能看到客户端自动跳转了

// res.statusCode = 302
// res.setHeader('Location', 'http://www.baidu.com')
// res.end()

```

### 包的说明性文件

建议每个项目都要有一个package.json文件（包描述文件，包含了用的模块等信息）

cmd中 npm init， 开始创建项目

完成后会自动创建好package.json文件

项目的依赖就可以在cmd中使用npm install

执行npm install包名的时候都加上--save这个选项， 可以自动在package.json中自动保存依赖项信息

npm5以后会有package-lock.json文件，当安装包时会出现这个文件，

npm5以后的版本不用加--save参数，它会自动保存依赖信息

package-lock.json这个文件会保存node_modules中所有包的信息（版本，下载地址）

这样的话，npm install 时速度提升

这个lock是用来锁定版本的，防止install下载时自动升级新版本

### npm常用命令以及镜像的问题

```js
npm --version
npm install --global npm       升级
npm init      建项目
npm install
npm install --save 包名       （下载并保存依赖项（package.json文件中的dependencies选项））

npm install 包名
npm uninstall --save 包名
npm help     查看使用帮助
npm 命令 --help     查看指定命令的帮助


镜像问题：
一
	# 在任意目录执行均可以(安装淘宝镜像)
	# --global 表示安装到全局，而非当前目录
	npm install --global cnpm
	以后安装包时就要cnpm insatll jquery
二
	npm install jquery --registry=https://registry.npm.taobao.org
三
	加入npm的配置文件中
	npm config set registry https://registry.npm.taobao.org
	查看npm的配置信息
	npm config list
```



### 原生封装ajax方法

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>全局属性 contenteditable,hidden</title>
</head>
<body>
    <li>列表2</li>
    <script>
        function get(url, callback) {
            var oReq = new XMLHttpRequest()
            // 当请求加载成功后要调用指定的函数
            oReq.onload = function () {
                // 我现在需要得到这里的oReq.responseText
                callback(oReq.responseText)
            }
            oReq.open("get", url, true)
        }
        get('http://127.0.0.1:8888/', function(data) {
            console.log(data)
        })
    </script>
</body>
</html>
```

### 自定义数组方法myFind

```js
Array.prototype.myFind = function(conditionFunc) {
	// var conditionFunc = function (item, index) {return item.id === 4}
	for (var i = 0; i < this.length; i++) {
		if (conditionFunc(this[i], i)){
			return this[i]
		}
	}
}

var ret = users.myFind(function (item, index) {
	return item.id === 4
})

console.log(ret)
```

### art-template的模板继承

```js
29art-template的模板继承.txt
官方文档：
http://aui.github.io/art-template/docs/index.html
在html body中写这   {{include './header.html'}}    引入文件
{{block 'content'}}
	<h1></h1>
{{/block}}
这样来留坑‘content’用来辨识填的是哪个坑,如果没有填坑就使用<h1></h1>内容
填坑也用{{block 'content'}} {{/block}}
{{extend './layout.html'}}  模板继承
```

### 模块系统

exports

module.exports

### require方法加载规则

```js
第三方模块：
	凡是第三方模块必须使用npm来下载
	使用的时候就可以require('包名')的方式来进行加载才可以使用
	不可能有任何一个第三方包和核心模块的名字是一样的
	既不是核心模块又不是路径形式的模块：
		先找到当前文件夹所处目录中的node_modules目录
		node_modules/art-template
		node_modules/art-template/package.json文件
		node_modules/art-template/package.json文件中的main属性
		main属性中就记录了art-template的入口模块
		然后加载使用这个第三方包
		实际上最终加载的还是文件


优先从缓存加载
核心模块
路径形式的文件模块
第三方模块
按照这个规则。。。
```

a.js

```js
console.log("a.js被加载了")
var fn = require('./b')
console.log(fn)
```

b.js

```js
console.log('b.js 被加载了')
module.exports = function() {
    console.log('hello bbb')
}
```

main.js

```js
require('./a')  // 加载a.js模块
var fn = require('./b')

console.log(fn)

/*
加载顺序为:
    main.js中加载a.js, 打印a被加载了
    a.js加载b.js, 打印b被加载了
    a.js继续往下运行， 获取b.js的数据存在fn中， 打印fn
    main.js继续向下运行， 只获取b的数据存在fn中，但不重新加载b.js
    打印fn
*/

```

### mongo数据库的连接以及基本操作

#### 链接

```js
var mongoose = require('mongoose');
// 连接MongoDB数据库
mongoose.connect('mongodb://localhost/test');

mongoose.Promise = global.Promise;

// 创建一个模型
// 就是在设计数据库
// MongoDB是动态的非常灵活，只需要在代码中设计你的数据库就可以了
// mongoose这个包可以让你的设计编写的过程变得非常简单
var Cat = mongoose.model('Cat', {name: String});

// 实例化一个Cat
var kitty = new Cat({name: 'Zildjian'});

// 持久化存储kitty实例
kitty.save(function(err){
	if(err){
		console.log(err);
	}else{
		console.log('neow');
	}
});

```

#### 操作

```js
var mongoose = require('mongoose')
// Mongoose 的一切始于 Schema。每个 schema 都会映射到一个 MongoDB collection ，并定义这个collection里的文档的构成。
var Schema = mongoose.Schema


// 1. 连接数据库
// 指定连接的数据库不需要已经存在，当你插入第一条数据之后就会自动被创建出来
mongoose.connect('mongodb://localhost/itcast')


// 设计集合结构（表结构）
// var blogSchema = new Schema({
// 	title: String,
// 	author: String,
// 	body: String,
// 	comments: [{ body: String, data: Date }],
// 	date: { type: Date, default: Date.now },
// 	hidden: Boolean,
// 	meta: {
// 		votes: Number,
// 		favs: Number
// 	}
// });


// 2 . 设计集合结构（表结构）
// 字段名称就是表结构中的属性名称
// 约束的目的是为了保证数据的完整性
var userSchema = new Schema({
	username: {
		type: String,
		required: true  // 必须有此数据
	},
	password: {
		type: String,
		required: true
	},
	email: {
		type: String
	}
})


// 3. 将文档发布为模型
// 	mongoose.model 用来将一个架构发布为model
// 	第一个参数：传入一个大写名称单数字符串用来表示数据库名称
// 		mongoose会自动将大写名词的字符串生成 小写复数 的集合名称
// 		例如这里的User最终会变成user集合名称
// 	第二个参数：架构Schema
// 	返回值： 模型构造函数
var User = mongoose.model('User', userSchema)

// 4. 以后就可以直接使用构造函数来对数据库中的函数进行操作


// 增

// var admin = new User({
// 	username: 'HHH',
// 	password: '123456',
// 	email: 'admin@admin.com'
// })

// // 做持久化存储
// admin.save(function (err, ret) {
// 	if (err){
// 		console.log('保存失败')
// 	}else{
// 		console.log("保存成功")
// 		console.log("ret")
// 	}
// })



// 查

// 1.最普通的查询(查询的结果为列表)
User.find(function (err, ret) {
	if(err) {
		console.log('查询失败')
	}else{
		console.log(ret)
	}
})

// 2. 条件查询(查询的结果为对象列表)
// User.find({
// 	username: 'HHH'
// }, function (err, ret) {
// 	if(err) {
// 		console.log('查询失败')
// 	}else{
// 		console.log(ret)
// 	}
// })

// 3. findOne（查询的结果为数组）
// User.findOne({
// 	username: 'HHH'
// }, function (err, ret) {
// 	if(err) {
// 		console.log('查询失败')
// 	}else{
// 		console.log(ret)
// 	}
// })



// 删

// User.remove({
// 	username: 'HHH'
// },function(err, ret){
// 	if(err){
// 		console.log("删除失败")
// 	}else{
// 		console.log("删除成功")
// 		console.log(ret)
// 	}
// })



// 更新数据(更多操作看文档)
// User.findByIdAndUpdate('5fc5da4c58bf1d157cd399ec',{
// 	password: '123'
// }, function(err, ret){
// 	if(err){
// 		console.log("更新失败")
// 	}else{
// 		console.log("更新成功")
// 	}
// })

```

### 链接mysql

```js
// 更多操作看（nodejs）文档 https://www.runoob.com/nodejs/nodejs-tutorial.html
var mysql = require('mysql')

// 1.创建连接
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '123456',
	database: 'login'
});

// 2. 连接数据库
connection.connect();

// 3. 执行数据操作
connection.query('select * form user;', function(error, results){
	console.log('111111111111111111111111111111111111111111111')
	if (error) throw error;
	console.log("The solution is:", results);
});

// 4. 关闭连接
connection.end();
```



### promise语法api

```js
var fs = require("fs")
// Promise是一个构造函数

// console.log(1)
// 创建一个Promise容器(promise本身不是异步，但容器中往往封装异步任务)
// promise一旦创建就开始执行里面的代码
var p1 = new Promise(function(resolve, reject){
	// console.log(2)
	fs.readFile('./data/a.txt', 'utf8', function(err, data){
		if(err){
			// console.log(err)
			// 把容器中Pending状态改为Rejected
			reject(err)
		}else{
			// console.log(3)
			// console.log(data)
			// 把容器中pending状态改为resolved
			resolve(data)
		}
	})
})
// console.log(4)
var p2 = new Promise(function(resolve, reject){
	// console.log(2)
	fs.readFile('./data/b.txt', 'utf8', function(err, data){
		if(err){
			// console.log(err)
			// 把容器中Pending状态改为Rejected
			reject(err)
		}else{
			// console.log(3)
			// console.log(data)
			// 把容器中pending状态改为resolved
			resolve(data)
		}
	})
})



// p1就是哪个承诺
// p1成功后然后then做指定的操作
// then方法接受的function就是容器中的resolve函数
p1
	.then( function (data) {  // 这个data就是resolve里的data
		console.log(data)
		// return "hello"
		// 真正有用的是return 一个promise对象
		return p2
	}, function (err) {  // 这个data就是reject里的err
		console.log('读取文件失败了', err)
	})
	.then( function (data) {  // 此data为上个函数return 的结果
		console.log(data)
	}, function (err) {  // 这个data就是reject里的err
		console.log('读取文件失败了', err)
	})
```

![image-20211029085515219](C:\Users\HDR\AppData\Roaming\Typora\typora-user-images\image-20211029085515219.png)

##### promise版readFile

```js
var fs = require('fs')

function pReadFile(filePath) {
	return new Promise(function(resolve, reject){
		fs.readFile(filePath, 'utf8', function(err, data){
			if(err){
				reject(err)
			}else{
				resolve(data)
			}
		})
	})
}

pReadFile('./data/a.txt')
	.then(function(data){
		console.log(data)
		return pReadFile('./data/b.txt')
	})
	.then(function(data){
		console.log(data)
		return pReadFile('./data/c.txt')
	})
	.then(function(data){
		console.log(data)
	})

```

### 笔记

```
服务端渲染：
	说白了就是在服务端使用模板引擎
	模板引擎最早诞生于服务端，后来发展到了前端
服务端渲染和客户端渲染的差别
	客户端渲染不利于SEO搜索引擎优化
	服务端是可以被爬虫抓取到的，客户端异步渲染更难被抓取
	所以真正的网站既不是纯异步也不是纯服务端渲染出来的，而是两者结合来做的
	例如京东的商品列表就采用的服务端渲染，目的是为了SEO搜索引擎优化
	而他的商品评论列表为了用户体验，而且也不需要SEO优化，所以采用客户端渲染
```

##### 建项目流程

```
建项目流程：
	1. 新建一个文件夹crud-express(在主目录下), cmd中cd到这个文件夹
	2. cmd中npm init -y  后会自动在crud-express中生成一个package.json
	3. 再在这个文件夹安装依赖npm install --save express。后就会自动生成一个node_modules文件夹。

```

