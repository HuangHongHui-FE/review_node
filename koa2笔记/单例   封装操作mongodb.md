### es5中的类和静态方法

```js
   function Person(name,age) {
       //构造函数里面的方法和属性
       this.name=name;
       this.age=age;
       this.run=function(){
           console.log(`${this.name}---${this.age}`)
       }
   }

   //原型链上面的属性和方法可以被多个实例共享
   Person.prototype.sex='男';
   Person.prototype.work=function(){
       console.log(`${this.name}---${this.age}---${this.sex}`);
   }

   //静态方法
   Person.setName=function(){
       console.log('静态方法');
   }
   var p=new Person('zhangsan','20');   /*实例方法是通过实例化来调用的，静态是通过类名直接调用*/
   p.run();
   p.work();

   Person.setName();  /*执行静态方法*/
```

### es5继承

```js
/*
原型链继承和对象冒充继承
 	对象冒充继承:没法继承原型链上面的属性和方法
 	原型链继承：可以继承构造函数里面以及原型链上面的属性和方法，实例化子类的时候没法给父类传参
* */
function  Person(name,age) {
    this.name=name;
    this.age=age;
    this.run=function(){
        console.log(this.name+'---'+this.age);
    }
}
Person.prototype.work=function(){
    console.log('work');
}

function Web(name,age){
    Person.call(this,name,age);  /*对象冒充实现继承*/
}

Web.prototype=new Person();
var w=new Web('李四',20);
w.run();
w.work();  //w.work is not a function
```

### es6中的类，静态方法，继承

#### 类

```js
class Person{
   constructor(name,age) {   /*类的构造函数，实例化的时候执行，new的时候执行*/
       this._name=name;
       this._age=age;
   }
   getName(){
       console.log(this._name);
   }
   setName(name){
       this._name=name
   }
}
var p=new Person('张三1','20');
p.getName();
p.setName('李四');
p.getName();
```

#### 继承

```js
class Person{
    constructor(name,age){
        this.name=name;
        this.age=age;
    }
    getInfo(){
        console.log(`姓名:${this.name} 年龄:${this.age}`);
    }
    run(){
        console.log('run')
    }
}
class Web extends Person{  //继承了Person     extends          super(name,age);
    constructor(name,age,sex){
        super(name,age);   /*实例化子类的时候把子类的数据传给父类*/
        this.sex=sex;
    }
    print(){

        console.log(this.sex);
    }
}
var w=new Web('张三','30','男');
w.getInfo();
```

#### 静态方法

```js
class Person{
    constructor(name){
        this._name=name;  /*属性*/
    }
    run(){  /*实例方法*/
        console.log(this._name);
    }
    static work(){   /*静态方法*/
        console.log('这是es6里面的静态方法');
    }
}
Person.instance='这是一个静态方法的属性';

var p=new  Person('张三');

p.run();
Person.work();   /*es6里面的静态方法*/

console.log(Person.instance);
```



#### es6单例

```js
class Db {
    static getInstance(){   /*单例*/
        if(!Db.instance){
            Db.instance=new Db();
        }
        return Db.instance;
    }
    constructor(){
        console.log('实例化会触发构造函数');
        this.connect();
    }
    connect(){
        console.log('连接数据库');
    }
    find(){
        console.log('查询数据库');
    }
}
var myDb=Db.getInstance();
var myDb2=Db.getInstance();
var myDb3=Db.getInstance();
var myDb4=Db.getInstance();
myDb3.find();
myDb4.find();
```



### mongodb增加数据，查询的性能测试

##### 增加

```js
var MongoClient = require('mongodb').MongoClient;

var dbUrl = 'mongodb://localhost:27017/';

var dbName = 'koa'

console.time('start1');
MongoClient.connect(dbUrl,(err,client)=>{
    if(err){
        console.log(err);
        return;
    }
    var db=client.db(dbName);
    //查询数据
    var result=db.collection('user').find({});
    result.toArray((err,docs)=>{
        console.timeEnd('start1');
        console.log(docs);
    })
})



console.time('start2');
MongoClient.connect(dbUrl,(err,client)=>{
    if(err){
        console.log(err);
        return;
    }
    var db=client.db(dbName);
    //查询数据
    var result=db.collection('user').find({});
    result.toArray((err,docs)=>{
        console.timeEnd('start2');
        console.log(docs);

    })
})
```

##### 查询

```js
var MongoClient = require('mongodb').MongoClient;

var dbUrl = 'mongodb://localhost:27017/';

var dbName = 'koa'

//连接数据库
console.time('start');
MongoClient.connect(dbUrl,(err,client)=>{
    if(err){
        console.log(err);
        return;
    }
    var db=client.db(dbName);
    console.timeEnd('start');
    //增加数据
  db.collection('user').insertOne({'username':"wangwu",'age':26,'sex':"男","status":"1"},	function(err,result){
        if(!err){
            //console.log('增加数据成功');
            client.close();
        }
    })
})
```



### 封装好的

![image-20211105085052204](C:\Users\HDR\AppData\Roaming\Typora\typora-user-images\image-20211105085052204.png)

##### db.js

```js
/**
 * http://mongodb.github.io/node-mongodb-native
 * http://mongodb.github.io/node-mongodb-native/3.0/api/
 */

//DB库
var MongoDB=require('mongodb');
var MongoClient =MongoDB.MongoClient;
const ObjectID = MongoDB.ObjectID;


var Config=require('./config.js');

class Db{
    static getInstance(){   /*1、单例  多次实例化实例不共享的问题*/
        if(!Db.instance){
            Db.instance=new Db();
        }
        return  Db.instance;
    }
    constructor(){
        this.dbClient=''; /*属性 放db对象*/
        this.connect();   /*实例化的时候就连接数据库*/
    }

    connect(){  /*连接数据库*/
      let _that=this;
      return new Promise((resolve,reject)=>{
          if(!_that.dbClient){         /*1、解决数据库多次连接的问题*/
              MongoClient.connect(Config.dbUrl, (err,client)=>{
                  if(err){
                      reject(err)
                  }else{
                      _that.dbClient=client.db(Config.dbName);
                      resolve(_that.dbClient)
                  }
              })
          }else{
              resolve(_that.dbClient);
          }
      })
    }

    find(collectionName,json){
       return new Promise((resolve,reject)=>{
            this.connect().then((db)=>{
                var result=db.collection(collectionName).find(json);
                result.toArray(function(err,docs){
                    if(err){
                        reject(err);
                        return;
                    }
                    resolve(docs);
                })

            })
        })
    }

    update(collectionName,json1,json2){
        return new Promise((resolve,reject)=>{
                this.connect().then((db)=>{
                    //db.user.update({},{$set:{}})
                    db.collection(collectionName).updateOne(json1,{
                        $set: json2
                    },(err,result)=>{
                        if(err){
                            reject(err);
                        }else{
                            resolve(result);
                        }
                    })

                })
        })
    }

    insert(collectionName,json){
        return new  Promise((resolve,reject)=>{
            this.connect().then((db)=>{
                db.collection(collectionName).insertOne(json,function(err,result){
                    if(err){
                        reject(err);
                    }else{

                        resolve(result);
                    }
                })
            })
        })
    }

    remove(collectionName,json){
        return new  Promise((resolve,reject)=>{
            this.connect().then((db)=>{
                db.collection(collectionName).removeOne(json,function(err,result){
                    if(err){
                        reject(err);
                    }else{
                        resolve(result);
                    }
                })
            })
        })
    }

    getObjectId(id){    /*mongodb里面查询 _id 把字符串转换成对象*/
        return new ObjectID(id);
    }
}


module.exports=Db.getInstance();
```

##### config.js

```js
var app={
    dbUrl: 'mongodb://localhost:27017/',
    dbName: 'koa'
}

module.exports=app;
```

##### app.js, 使用封装好的库

```js
var Koa=require('koa'),
    router = require('koa-router')(),
    render = require('koa-art-template'),
    path=require('path'),
    bodyParser=require('koa-bodyparser'),
    DB=require('./module/db.js');

var app=new Koa();

//配置post提交数据的中间件
app.use(bodyParser());

//配置 koa-art-template模板引擎
render(app, {
    root: path.join(__dirname, 'views'),   // 视图的位置
    extname: '.html',  // 后缀名
    debug: process.env.NODE_ENV !== 'production'  //是否开启调试模式
});

//显示学员信息
router.get('/',async (ctx)=>{
    var result=await DB.find('user',{});
    console.log(result);
    await ctx.render('index',{
        list:result
    });
})

//增加学员
router.get('/add',async (ctx)=>{
    await ctx.render('add');
})

//执行增加学员的操作
router.post('/doAdd',async (ctx)=>{
    //获取表单提交的数据
   // console.log(ctx.request.body);  //{ username: '王麻子', age: '12', sex: '1' }
    let data=await DB.insert('user',ctx.request.body);
    //console.log(data);
    try{
        if(data.result.ok){
            ctx.redirect('/')
        }
    }catch(err){
        console.log(err);
        return;
        ctx.redirect('/add');
    }
})


//编辑学员
router.get('/edit',async (ctx)=>{
    //通过get传过来的id来获取用户信息
    let id=ctx.query.id;
    let data=await DB.find('user',{"_id":DB.getObjectId(id)});
    //获取用户信息
    await ctx.render('edit',{
        list:data[0]
    });
})


router.post('/doEdit',async (ctx)=>{
    //通过get传过来的id来获取用户信息
    //console.log(ctx.request.body);
    var id=ctx.request.body.id;
    var username=ctx.request.body.username;
    var age=ctx.request.body.age;
    var sex=ctx.request.body.sex;

    let data=await DB.update('user',{"_id":DB.getObjectId(id)},{
        username,age,sex
    })

    try{
        if(data.result.ok){
            ctx.redirect('/')
        }
    }catch(err){
        console.log(err);
        return;
        ctx.redirect('/');
    }

})


//删除学员
router.get('/delete',async (ctx)=>{
    let id=ctx.query.id;
    var data=await DB.remove('user',{"_id":DB.getObjectId(id)});
    console.log(data);
    if(data){
        ctx.redirect('/')
    }
})

app.use(router.routes());   /*启动路由*/
app.use(router.allowedMethods());
app.listen(3000);
```

