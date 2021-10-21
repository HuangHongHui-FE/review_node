### 大地node与express

### http创建服务

```js
const http =require('http');

http.createServer((req,res)=>{
    console.log(req.url);
    res.writeHead(200,{"Content-type":"text/html;charset='utf-8'"}); //解决乱码
    res.write("<head> <meta charset='UTF-8'></head>");  //解决乱码
    res.write('你好 nodejs');
    res.write('<h2>你好 nodejs</h2>');
    res.end();  //结束响应
}).listen(3000);
```



### url模块的使用

```js
const url=require('url');
var api='http://www.itying.com?name=zhangsan&age=20';

// 加上true变成一个对象
console.log(url.parse(api,true));

var getValue=url.parse(api,true).query;
console.log(getValue);
console.log(`姓名：${getValue.name}--年龄:${getValue.age}`);
```

### 

### supervisor修改代码重启web服务

1、安装cnpm

	http://npm.taobao.org/
	
	npm install -g cnpm --registry=https://registry.npm.taobao.org

cnpm -g install supervisor

supervisor app.js

### 

### commonJS和nodejs模块

common.js

```js
var request=require('./module/request');

console.log(request);  //{ xxxx: { get: [Function: get], post: [Function: post] } }

request.get();

request.post();
```

![image-20211021142952178](C:\Users\HDR\AppData\Roaming\Typora\typora-user-images\image-20211021142952178.png)

request.js

```js
var obj={
    get:function(){
        console.log('从服务器获取数据')
    },
    post:function(){
        console.log('提交数据')
    }
}
module.exports=obj;
```



### nodejs中的包

##### 安装时指定版本

    npm install jquery@1.8.0
    npm install node-media-server@2.1.0 --save

##### silly-datatime

```js
var sd = require('silly-datetime');
var d=sd.format(new Date(), 'YYYY-MM-DD HH:mm');
console.log(d);
```

##### md5

```js
var md5 = require('md5');
console.log(md5('123456'));
```



### fs模块

  1. fs.stat        检测是文件还是目录
  2. fs.mkdir       创建目录
  3. fs.writeFile        创建写入文件
  4. fs.appendFile       追加文件
  5. fs.readFile       读取文件
  6. fs.readdir       读取目录
  7. fs.rename      重命名 移动文件
  8. fs.rmdir        删除目录
  9. fs.unlink      删除文件

##### 注意参数

```js
const fs=require('fs');

fs.stat('./html',(err,data)=>{
    if(err){
        console.log(err);
        return;
    }
    console.log(`是文件:${data.isFile()}`);
    console.log(`是目录:${data.isDirectory()}`);
})
```

```js
fs.mkdir('./css',(err)=>{
    if(err){
        console.log(err);
        return;
    }
    console.log('创建成功');
})
```

```js
fs.writeFile('./html/index.html','你好nodejs',(err)=>{
    if(err){
        console.log(err);
        return;
    }
    console.log('创建写入文件成功');
})
```

```js
fs.appendFile('./css/base.css','body{color:red}',(err)=>{
    if(err){
        console.log(err);
        return;
    }
    console.log('appendFile 成功');
})
```



```js
fs.readFile('./html/index.html',(err,data)=>{
    if(err){
        console.log(err);
        return;
    }
    console.log(data);
    console.log(data.toString());  //把Buffer 转化成string类型
})
```



```js
fs.readdir('./html',(err,data)=>{
    if(err){
        console.log(err);
        return;
    }
    console.log(data);
})
```



```js
fs.rename('./css/index.css','./html/index.css',(err)=>{
    if(err){
        console.log(err);
        return;
    }
    console.log('移动文件成功');
})
```



```js
fs.rename('./css/aaa.css','./css/index.css',(err)=>{

    if(err){
        console.log(err);
        return;
    }

    console.log('重命名成功');
})
```



```js
fs.rmdir('./aaaa',(err)=>{
    if(err){
        console.log(err);
        return;
    }
    console.log('删除目录成功');
})
```



```js
fs.unlink('./aaaa/index.html',(err)=>{
    if(err){
        console.log(err);
        return;
    }
    console.log('删除文件成功');
})
```



### mkdirp包的使用

cnpm i mkdirp --save

```js
var mkdirp = require('mkdirp');

mkdirp('./upload/aaa/xxxx', function (err) {
    if (err) {
        console.error(err);
    }    
});
```



### fs中的流以及管道流

##### fs读取流监听事件

```js
const fs=require('fs');
var readStream=fs.createReadStream('./data/input.txt');

var count=0;
var str='';

readStream.on('data',(data)=>{
    str+=data;
    count++;
})

readStream.on('end',()=>{
    console.log(str);
    console.log(count)
})

readStream.on('error',(err)=>{
    console.log(err);   
})
```

##### 写入流，标记事件

```js
const fs=require('fs');
var str = '';

for(var i=0;i<500;i++){
    str+='我是从数据库获取的数据，我要保存起来1111\n';
}

var writeStream=fs.createWriteStream('./data/output.txt');

writeStream.write(str);

//标记文件末尾
writeStream.end();

writeStream.on('finish',()=>{
    console.log('写入完成');
})
```

##### 管道流

```js
const fs=require('fs');
var readStream=fs.createReadStream('./demo08.zip');

var writeStream=fs.createWriteStream('./data/demo.zip');

readStream.pipe(writeStream);
```

### 获取文件后缀名

```js
//可以获取后缀名path.extname() 
let extname=path.extname(pathname);
```



### 调用Mongodb实现数据的增删改

注意：如果数据库开启了权限验证的话需要使用下面方式连接数据库 

```
const url = 'mongodb://admin:123456@localhost:27017/'; 
```

其中：admin 表示用户名，123456 表示密码

```js
// 1 cnpm install mongodb --save

//2、引入mongodb
const { MongoClient } = require('mongodb');

//3、定义数据库连接的地址
const url = 'mongodb://127.0.0.1:27017';

//4、定义要操作的数据库
const dbName = 'itying';

//5、实例化MongoClient 传入数据库连接地址
const client = new MongoClient(url, { useUnifiedTopology: true });

//6、连接数据库 操作数据
client.connect((err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log("数据库连接成功");
    let db = client.db(dbName);  // 切换到这个数据库

    // //1、查找数据
    db.collection("user").find({"age":13}).toArray((err,data)=>{
       if(err){ 
            console.log(err);
            return;
        }
        console.log(data);       
        //操作数据库完毕以后一定要 关闭数据库连接
        client.close();
    })
    

    //2、增加数据

    // db.collection("user").insertOne({"username":"nodejs操作mongodb","age":10},(err,result)=>{
    //     if(err){ //增加失败
    //         console.log(err);
    //         return;
    //     }
    //     console.log("增加成功");
    //     console.log(result);
    //       //操作数据库完毕以后一定要 关闭数据库连接
    //      client.close();
    // })


    //3、修改数据

    // db.collection("user").updateOne({ "name": "zhangsan" }, { $set: { "age": 10 } }, (err, result) => {
    //     if (err) { //修改失败
    //         console.log(err);
    //         return;
    //     }
    //     console.log("修改成功");
    //     console.log(result);
    //     //操作数据库完毕以后一定要 关闭数据库连接
    //     client.close();
    // })


    //4、删除一条数据

    // db.collection("user").deleteOne({ "username": "nodejs" }, (err)=>{

    //     if (err) { 
    //         console.log(err);
    //         return;
    //     }
    //     console.log("删除一条数据成功");
    //     client.close();
    // })

     //5、删除多条数据

    // db.collection("user").deleteMany({ "username": "nodejs" }, (err)=>{
        
    //     if (err) { 
    //         console.log(err);
    //         return;
    //     }
    //     console.log("删除多条数据成功");
    //     client.close();
    // })

})
```

### 

### 结合路由使用mongodb

```js
const http = require("http");

const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017';
const dbName = 'itying';
// const client = new MongoClient(url,{ useUnifiedTopology: true });
//注册web服务
http.createServer(app).listen(3000);
// app.static("public");    //修改默认静态web目录
//配置路由
app.get('/', function (req, res) {
    MongoClient.connect(url,{ useUnifiedTopology: true }, (err, client) => {
        if (err) {
            console.log(err);
            return;
        }
        let db = client.db(dbName);

        //查询数据
        db.collection("user").find({}).toArray((err, result) => {
            if (err) {
                console.log(err);
                return;
            }       
            
            client.close();
            ejs.renderFile("./views/index.ejs", {
                list: result
            }, (err, data) => {
                res.send(data);
            })
        })

    })


})


app.get('/register', function (req, res) {
    ejs.renderFile("./views/register.ejs",{},(err,data)=>{
        res.send(data);
    })
})

app.post('/doRegister', function (req, res) {
    MongoClient.connect(url,{ useUnifiedTopology: true },(err,client)=>{

        if(err){
            console.log(err);
            return;
        }
        let db=client.db(dbName);

        db.collection("user").insertOne(body,(err,result)=>{
            if(err){
                console.log(err);
                return;
            }
            console.log("增加数据成功");
            res.send("增加数据成功");
        })

    })
})
```

