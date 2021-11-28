## 模块系统

### `require` 模块导入

```js
// 核心模块
var fs = require("fs");

// 第三方模块
// npm install marked
var marked = require("marked");

// 注意：加载自己写的模块，相对路径不能省略 ./
var foo = require("./foo.js");

// 用户模块（自己写的），正确的（推荐），可以省略后缀名 .js
var foo = require("./foo");
```

### `exports` 模块导出

##### **导出多个成员：写法一（麻烦，不推荐）：**

```js
// 导出多个成员：写法一
module.exports.a = 123;
module.exports.b = 456;
module.exports.c = 789;
```

##### **导出多个成员：写法二（推荐）**

Node 为了降低开发人员的痛苦，所以为 `module.exports` 提供了一个别名 `exports` （下面协大等价于上面的写法）。

```js
console.log(exports === module.exports); // => true
exports.a = 123;
exports.b = 456;
exports.c = 789;
exports.fn = function() {};
```

##### 导出多个成员：写法三（代码少可以，但是代码一多就不推荐了）

```js
// module.exports = {
//   d: 'hello',
//   e: 'world',
//   fn: function () {
//     //
//     //
//     //
//     //
//     //
//     //
//     //
//     //
//     //
//     //
//     //
//     //
//     //
//     //
//     //
//     //
//     //
//     //
//     //
//     //
//     //
//     //
//     //
//     //
//     //
//     //
//     //
//     //
//     // fs.readFile(function () {

//     // })
//   }
// }
```

##### 导出单个成员：（唯一的写法）：

```js
// 导出单个成员：错误的写法
// 因为每个模块最终导出是 module.exports 而不是 exports 这个别名
// exports = function (x, y) {
//   return x + y
// }

// 导出单个成员：必须这么写
module.exports = function(x, y) {
  return x + y;
};
```

导出单个只能导出一次，下面的情况后者会覆盖前者：

```js
module.exports = "hello";

// 以这个为准，后者会覆盖前者
module.exports = function(x, y) {
  return x + y;
};
```

### exports 和 module.exports 的区别

- - 每个模块中都有一个 module 对象

- - module 对象中有一个 exports 对象

- - 我们可以把需要导出的成员都挂载到 module.exports 接口对象中

- - 也就是：`moudle.exports.xxx = xxx` 的方式

- - 但是每次都 `moudle.exports.xxx = xxx` 很麻烦，点儿的太多了

- - 所以 Node 为了你方便，同时在每一个模块中都提供了一个成员叫：`exports`

- - `exports === module.exports` 结果为 `true`

- - 所以对于：`moudle.exports.xxx = xxx` 的方式 完全可以：`expots.xxx = xxx`

- - 当一个模块需要导出单个成员的时候，这个时候必须使用：`module.exports = xxx` 的方式

- - 不要使用 `exports = xxx` 不管用

- - 因为每个模块最终向外 `return` 的是 **module.exports**

- - 而 `exports` 只是 `module.exports` 的一个引用

- - 所以即便你为 `exports = xx` 重新赋值，也不会影响 `module.exports`

- - 但是有一种赋值方式比较特殊：`exports = module.exports` 这个用来重新建立引用关系的

#### 模块加载流程

![image-20211105094153561](C:\Users\HDR\AppData\Roaming\Typora\typora-user-images\image-20211105094153561.png)

## npm常用

```js

# 安装指定的包，可以简写为 npm i 包名
# npm 5 以前只下载，不会保存依赖信息，如果需要保存，则需要加上 `--save` 选项
# npm 5 以后就可以省略 --save 选项了
npm install 包名

# 安装指定版本的包
npm install 包名@版本号

# npm list命令以树型结构列出当前项目安装的所有模块，以及它们依赖的模块。
npm list

# 加上global参数，会列出全局安装的模块
npm list -global

# npm list命令也可以列出单个模块
npm list 包名

# 更新本地安装的模块
# 它会先到远程仓库查询最新版本，然后查询本地版本。如果本地版本不存在，或者远程版本较新，就会安装
npm update [package name]

# 升级全局安装的模块
npm update -global [package name]


# 查看包信息
# view 别名：v、info、show
npm view 包名

# 查看使用帮助
npm help

# 查看某个命令的使用帮助
npm 命令 --help
```

### 切换 npm 镜像源

- `npm install jquery --registry=https://registry.npm.taobao.org`

- `npm config set registry https://registry.npm.taobao.org`

\# 查看 registry 是否配置正确 **npm config get registry**



### npx

Node 自带 npm 模块，所以可以直接使用 npx 命令。万一不能用，就要手动安装一下。

```
npm install -g npx
```

#### 调用项目安装的模块

npx 想要解决的主要问题，就是调用项目内部安装的模块。比如，项目内部安装了测试工具 [Mocha](http://www.ruanyifeng.com/blog/2015/12/a-mocha-tutorial-of-examples.html)。

```
npm install -D mocha
```

一般来说，调用 Mocha ，只能在项目脚本和 package.json 的`scripts`字段里面， 如果想在命令行下调用，必须像下面这样。

```
# 项目的根目录下执行
$ node-modules/.bin/mocha --version
```

npx 就是想解决这个问题，让项目内部安装的模块用起来更方便，只要像下面这样调用就行了。

```
npx mocha --version
```

npx 的原理很简单，就是运行的时候，会到`node_modules/.bin`路径和环境变量`$PATH`里面，检查命令是否存在。

#### 避免全局安装模块

除了调用项目内部模块，npx 还能避免全局安装的模块。比如，`create-react-app`这个模块是全局安装，npx 可以运行它，而且不进行全局安装。

```
npx create-react-app my-react-app
```

上面代码运行时，npx 将`create-react-app`下载到一个临时目录，使用以后再删除。所以，以后再次执行上面的命令，会重新下载`create-react-app`。

##### 下载全局模块时，npx 允许指定版本。

```
npx uglify-js@3.1.0 main.js -o ./dist/main.js
```

上面代码指定使用 3.1.0 版本的`uglify-js`压缩脚本。

#### 使用不同版本的 node

利用 npx 可以下载模块这个特点，可以指定某个版本的 Node 运行脚本。它的窍门就是使用 npm 的 [node 模块](https://www.npmjs.com/package/node)。

```
npx node@0.12.8 -v
v0.12.8
```

上面命令会使用 0.12.8 版本的 Node 执行脚本。原理是从 npm 下载这个版本的 node，使用后再删掉。

某些场景下，这个方法用来切换 Node 版本，要比 nvm 那样的版本管理器方便一些。

同步与异步文件系统调用的区别

## 文件操作

### 同步和异步

fs 模块对文件的几乎所有操作都有同步和异步两种形式，例如：`readFile()` 和 `readFileSync()`。

- 同步调用立即执行，会阻塞后续代码继续执行，如果想要捕获异常需要使用 `try-catch`

- 异步调用不会阻塞后续代码继续执行，需要回调函数作为额外的参数，通常包含一个错误作为回调函数的第一个参数

- 异步调用通过判断第一个 err 对象来处理异常

- 异步调用结果往往通过回调函数来进行获取

Node 只在文件 IO 操作中，提供了同步调用和异步调用两种形式，两者可以结合使用，
但是推荐能使用异步调用解决问题的情况下，少用同步调用。

对于文件操作，Node 几乎为所有的文件操作 API 提供了同步操作和异步操作两种方式。

- 同步会阻塞程序的执行，效率低（知道就行）

- 异步相当于多找了一个人帮你干活，效率高

- 所以建议：尽量使用异步

### 文件操作的相对路径

建议：以后操作文件使用相对路径都使用 `path.join()` 方法结合 `__dirname` 来避免问题。

### __dirname和 __filename

在每个模块中，除了 `require`、`exports` 等模块成员之外，还有两个特殊的成员：

- `__dirname` **动态获取** 当前文件模块所属目录的绝对路径

- `__filename` **动态获取** 当前文件的绝对路径



## 在浏览器输入一个地址到看到网站内容经历了什么



1. 用户在浏览器地址栏中输入网站域名

1. 浏览器拿到该域名自动去请求 **DNS 服务器查询** 用户输入的域名对应的 `ip` 地址

1. 浏览器拿到 `ip` 地址之后，通过 ip 地址+端口号（HTTP 默认 80）和服务器建立连接（通过 **三次握手** ）

1. 三次握手建立连接成功之后

1. 浏览器将用户输入的 `url` 地址通过 `HTTP` 协议包装成 **请求报文** ，然后通过 `Socket（服务器ip地址和端口号）` 发送到服务器

1. 当 HTTP 服务器接收到客户端浏览器发送过来的请求报文时候，按照 `HTTP` 协议将请求报文解析出来

1. 然后服务器拿到请求报文中的请求信息（例如请求路径 url），做相应的业务逻辑处理操作

1. 当业务逻辑处理完毕之后，服务器将要发送给客户端的数据按照 `HTTP` 协议包装成 **响应报文**

1. 然后服务器将响应报文数据发送给客户端浏览器

1. 当浏览器接收到服务器发送给自己的响应报文数据的时候，浏览器根据 `HTTP` 协议将报文内容解析出来

1. 浏览器拿到响应报文体中的数据开始 **解析渲染 html、css，执行 JavaScript**

1. 如果在解析的过程（从上到下）中，发现有外链的标签（link、css、img）

1. 浏览器会自动对该标签指向的 路径地址 发起新的请求，同上。

## 请求响应流程

1. 用户打开浏览器
2. 地址栏输入我们需要访问的网站网址（URL）

1. 浏览器通过 DNS 服务器获取即将访问的网站 IP
2. 浏览器发起一个对这个 IP 的请求

1. 服务端接收到这个请求，进行相应的处理（如果是静态文件请求，就读取这个文件）
2. 服务端将处理完的结果返回给客户端浏览器

1. 浏览器将服务端返回的结果呈现到界面上

## express

### 处理静态资源

```js
// 开放 public 目录中的资源
// 不需要访问前缀
app.use(express.static("public"));

// 开放 files 目录资源，同上
app.use(express.static("files"));

// 开放 public 目录，限制访问前缀
app.use("/public", express.static("public"));

// 开放 public 目录资源，限制访问前缀
app.use("/static", express.static("public"));

// 开放 publi 目录，限制访问前缀
// path.join(__dirname, 'public') 会得到一个动态的绝对路径
app.use("/static", express.static(path.join(__dirname, "public")));
```

### 中间件

##### 打印日志

```js
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} ${Date.now()}`);
  next();
});

app.get("/", (req, res) => {
  res.send("index");
});

app.get("/about", (req, res) => {
  res.send("about");
});

app.get("/login", (req, res) => {
  res.send("login");
});
```

#### 应用程序级别中间件

```js
var app = express();
// 不关心请求路径：
app.use(function(req, res, next) {
  console.log("Time:", Date.now());
  next();
});
// 限定请求路径：
app.use("/user/:id", function(req, res, next) {
  console.log("Request Type:", req.method);
  next();
});
// 限定请求方法：
app.get("/user/:id", function(req, res, next) {
  res.send("USER");
});
// 多个处理函数：
app.use(
  "/user/:id",
  function(req, res, next) {
    console.log("Request URL:", req.originalUrl);
    next();
  },
  function(req, res, next) {
    console.log("Request Type:", req.method);
    next();
  }
);
// 多个路由处理函数：
app.get(
  "/user/:id",
  function(req, res, next) {
    console.log("ID:", req.params.id);
    next();
  },
  function(req, res, next) {
    res.send("User Info");
  }
);
// handler for the /user/:id path, which prints the user ID
app.get("/user/:id", function(req, res, next) {
  res.end(req.params.id);
});
```

#### 路由级别中间件

```js
var app = express();
var router = express.Router();

router.use(function(req, res, next) {
  console.log("Time:", Date.now());
  next();
});

router.use(
  "/user/:id",
  function(req, res, next) {
    console.log("Request URL:", req.originalUrl);
    next();
  },
  function(req, res, next) {
    console.log("Request Type:", req.method);
    next();
  }
);

router.get(
  "/user/:id",
  function(req, res, next) {
    if (req.params.id === "0") next("route");
    else next();
  },
  function(req, res, next) {
    res.render("regular");
  }
);
app.use("/", router);
```

##### 实例

```js
var app = express();
var router = express.Router();

router.use(function(req, res, next) {
  if (!req.headers["x-auth"]) return next("router");
  next();
});

router.get("/", function(req, res) {
  res.send("hello, user!");
});

app.use("/admin", router, function(req, res) {
  res.sendStatus(401);
});
```

#### 错误处理中间件

```js
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
```



## node操作mysql数据库

**npm install mysql**

基本使用

```js
var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  user: "me",

  password: "secret",
  database: "my_db"
});

connection.connect();

connection.query("SELECT 1 + 1 AS solution", function(error, results, fields) {
  if (error) throw error;
  console.log("The solution is: ", results[0].solution);
});

connection.end();
```

#### 增删改查

##### 查询

```js
connection.query('SELECT * FROM `books` WHERE `author` = "David"', function(
  error,
  results,
  fields
) {
  // error will be an Error if one occurred during the query
  // results will contain the results of the query
  // fields will contain information about the returned results fields (if any)
});
```

```js
connection.query(
  "SELECT * FROM `books` WHERE `author` = ?",
  ["David"],
  function(error, results, fields) {
    // error will be an Error if one occurred during the query
    // results will contain the results of the query
    // fields will contain information about the returned results fields (if any)
  }
);
```

##### 添加

```js
var post = { id: 1, title: "Hello MySQL" };
var query = connection.query("INSERT INTO posts SET ?", post, function(
  error,
  results,
  fields
) {
  if (error) throw error;
  // Neat!
});
console.log(query.sql); // INSERT INTO posts SET `id` = 1, `title` = 'Hello MySQL'
```

##### 删除

```js
connection.query('DELETE FROM posts WHERE title = "wrong"', function(
  error,
  results,
  fields
) {
  if (error) throw error;
  console.log("deleted " + results.affectedRows + " rows");
});
```

##### 修改

```js
connection.query(
  "UPDATE users SET foo = ?, bar = ?, baz = ? WHERE id = ?",
  ["a", "b", "c", userId],
  function(error, results, fields) {
    if (error) throw error;
    // ...
  }
);
```

#### 连接池

```js
var mysql = require("mysql");
var pool = mysql.createPool({
  host: "example.org",
  user: "bob",
  password: "secret",
  database: "my_db",
  connectionLimit: 10 // 默认是 10 个
});

pool.getConnection(function(err, connection) {
  // Use the connection
  connection.query("SELECT something FROM sometable", function(
    error,
    results,
    fields
  ) {
    // 释放回连接池
    connection.release();

    // 处理错误
    if (error) throw error;

    // ...
  });
});
```

#### 封装 dbHelper.js

```js
const mysql = require("mysql");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "test",
  connectionLimit: 10 // 默认是 10 个
});

exports.query = (...args) => {
  // 从数组中弹出最后一个元素 callback 回调函数
  const callback = args.pop();

  pool.getConnection((err, connection) => {
    if (err) {
      return callback(err);
    }

    connection.query(...args, function(...results) {
      // ...results => [err, results, fields]
      // 释放回连接池
      connection.release();
      // 把 ...results => [err, results, fields] 展开调用 callback 继续往外抛
      callback(...results);
    });
  });
};
```

## ajax

使用 AJAX 的过程可以类比平常我们访问网页过程

```js
// 1. 创建一个 XMLHttpRequest 类型的对象 —— 相当于打开了一个浏览器
var xhr = new XMLHttpRequest();
// 2. 打开与一个网址之间的连接 —— 相当于在地址栏输入访问地址
xhr.open("GET", "./time.php");
// 3. 通过连接发送一次请求 —— 相当于回车或者点击访问发送请求
xhr.send(null);
// 4. 指定 xhr 状态变化事件处理函数 —— 相当于处理网页呈现后的操作
xhr.onreadystatechange = function() {
  // 通过 xhr 的 readyState 判断此次请求的响应是否接收完成
  if (this.readyState === 4) {
    // 通过 xhr 的 responseText 获取到响应的响应体™
    console.log(this);
  }
};
```

### readyState

由于 `readystatechange` 事件是在 `xhr` 对象状态变化时触发（不单是在得到响应时），也就意味着这个事件会被触发多次，所以我们有必要了解每一个状态值代表的含义：

| readyState | 状态描述         | 说明                                                      |
| ---------- | ---------------- | --------------------------------------------------------- |
| 0          | UNSENT           | 代理（XHR）被创建，但尚未调用 `open()` 方法。             |
| 1          | OPENED           | `open()` 方法已经被调用，建立了连接。                     |
| 2          | HEADERS_RECEIVED | `send()` 方法已经被调用，并且已经可以获取状态行和响应头。 |
| 3          | LOADING          | 响应体下载中， `responseText` 属性可能已经包含部分数据。  |
| 4          | DONE             | 响应体下载完成，可以直接使用 `responseText`。             |

```js
var xhr = new XMLHttpRequest();
// 代理（XHR）被创建，但尚未调用 open() 方法。
console.log(xhr.readyState);
// => 0

xhr.open("GET", "./time.php");

// open() 方法已经被调用，建立了连接。
console.log(xhr.readyState);
// => 1

xhr.send(null);

xhr.onreadystatechange = function() {
  console.log(this.readyState);
  // send() 方法已经被调用，并且已经可以获取状态行和响应头。
  // => 2
  // 响应体下载中， responseText 属性可能已经包含部分数据。
  // => 3
  // 响应体下载完成，可以直接使用 responseText。
  // => 4
};
```

通过理解每一个状态值的含义得出一个结论：一般我们都是在 readyState 值为 4 时，执行响应的后续逻辑。

```
xhr.onreadystatechange = function() {
  if (this.readyState === 4) {
    // 后续逻辑......
  }
};
```

#### 遵循 HTTP

```js
// 设置请求报文的请求行
xhr.open("GET", "./time.php");
// 设置请求头
xhr.setRequestHeader("Accept", "text/plain");
// 设置请求体
xhr.send(null);

xhr.onreadystatechange = function() {
  if (this.readyState === 4) {
    // 获取响应状态码
    console.log(this.status);
    // 获取响应状态描述
    console.log(this.statusText);
    // 获取响应头信息
    console.log(this.getResponseHeader("Content-Type")); // 指定响应头
    console.log(this.getAllResponseHeader()); // 全部响应头
    // 获取响应体
    console.log(this.responseText); // 文本形式
    console.log(this.responseXML); // XML 形式，了解即可不用了
  }
};
```

### GET 请求

```js
var xhr = new XMLHttpRequest();
// GET 请求传递参数通常使用的是问号传参
// 这里可以在请求地址后面加上参数，从而传递数据到服务端
xhr.open("GET", "./delete.php?id=1");
// 一般在 GET 请求时无需设置响应体，可以传 null 或者干脆不传
xhr.send(null);
xhr.onreadystatechange = function() {
  if (this.readyState === 4) {
    console.log(this.responseText);
  }
};

// 一般情况下 URL 传递的都是参数性质的数据，而 POST 一般都是业务数据
```

### POST 请求

```js
var xhr = new XMLHttpRequest();
// open 方法的第一个参数的作用就是设置请求的 method
xhr.open("POST", "./add.php");
// 设置请求头中的 Content-Type 为 application/x-www-form-urlencoded
// 标识此次请求的请求体格式为 urlencoded 以便于服务端接收数据
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
// 需要提交到服务端的数据可以通过 send 方法的参数传递
// 格式：key1=value1&key2=value2
xhr.send("key1=value1&key2=value2");
xhr.onreadystatechange = function() {
  if (this.readyState === 4) {
    console.log(this.responseText);
  }
};
```

### 同步与异步

`xhr.open()` 方法第三个参数要求传入的是一个 `bool` 值，其作用就是设置此次请求是否采用异步方式执行，默认为 `true`，如果需要同步执行可以通过传递 `false` 实现：

```js
console.log("before ajax");
var xhr = new XMLHttpRequest();
// 默认第三个参数为 true 意味着采用异步方式执行
xhr.open("GET", "./time.php", true);
xhr.send(null);
xhr.onreadystatechange = function() {
  if (this.readyState === 4) {
    // 这里的代码最后执行
    console.log("request done");
  }
};
console.log("after ajax");
```

如果采用同步方式执行，则代码会卡死在 `xhr.send()` 这一步：

```js
console.log("before ajax");
var xhr = new XMLHttpRequest();
// 同步方式
xhr.open("GET", "./time.php", false);
// 同步方式 执行需要 先注册事件再调用 send，否则 readystatechange 无法触发
xhr.onreadystatechange = function() {
  if (this.readyState === 4) {
    // 这里的代码最后执行
    console.log("request done");
  }
};
xhr.send(null);
console.log("after ajax");
```

### 响应数据格式

#### XML

一种数据描述手段

老掉牙的东西，简单演示一下，不在这里浪费时间，基本现在的项目不用了。

淘汰的原因：数据冗余太多

#### JSON

也是一种数据描述手段，类似于 JavaScript 字面量方式

服务端采用 JSON 格式返回数据，客户端按照 JSON 格式解析数据。

不管是 JSON 也好，还是 XML，只是在 AJAX 请求过程中用到，并不代表它们之间有必然的联系，它们只是数据协议罢了

### 兼容方案

XMLHttpRequest 在老版本浏览器（IE5/6）中有兼容问题，可以通过另外一种方式代替

```
var xhr = XMLHttpRequest
  ? new XMLHttpRequest()
  : new ActiveXObject("Microsoft.XMLHTTP");
```



## 综合案例

![image-20211105102606264](C:\Users\HDR\AppData\Roaming\Typora\typora-user-images\image-20211105102606264.png)

### 导入并开放静态资源

1.  将模板中的 html 静态文件放到项目的 `views` 目录中 
2.  将模板中的静态资源（css、图片、客户端 js）放到 `public` 目录中 
3. 在 Web 服务中把 `public` 目录开放出来 

```js
...
const path = require('path')
app.use('/public', express.static(path.join(__dirname, './public')))
... 
```

### 配置模板引擎

npm i art-template express-art-template

```js
// res.render() 的时候默认去 views 中查找模板文件
// 如果想要修改，可以使用下面的方式
app.set('views', '模板文件存储路径')

// express-art-template 内部依赖了 art-template
app.engine('html', require('express-art-template'))
```

使用

```js
app.get("/", (req, res, next) => {
  // render 方法内部就会去
  // 1. 读取文件
  // 2. 模板引擎解析替换
  // 3. 发送响应结果
  res.render("index.html");
});
```



### 封装数据库操作模块

##### 连接池

```js
var mysql = require("mysql");
var pool = mysql.createPool({
  connectionLimit: 10,
  host: "example.org",
  user: "bob",
  password: "secret",
  database: "my_db"
});

pool.query("SELECT 1 + 1 AS solution", function(error, results, fields) {
  if (error) throw error;
  console.log("The solution is: ", results[0].solution);
});
```

项目的很多地方都要操作数据库，我们将数据库操作封装为了一个单独的工具模块放到了 `utils/db.js` 

```js
const mysql = require("mysql");

// 创建一个连接池
// 连接池中创建了多个连接
const pool = mysql.createPool({
  connectionLimit: 10, // 连接池的限制大小
  host: "localhost",
  user: "root",
  password: "123456",
  database: "alishow63"
});

// 把连接池导出
// 谁要操作数据库，谁就加载 db.js 模块，拿到 poll，点儿出 query 方法操作
module.exports = pool;
```

例如在 `xxx` 模块中需要操作数据库，则可以直接

```js
const db = require('db模块路径')

// 执行数据库操作
db.query()...
```



### 全局错误处理

执行错误处理中间件挂载的代码必须在我们的路由执行挂载之后

```
app.use((err, req, res, next) => {
  // 1. 记录错误日志
  // 2. 一些比较严重的错误，还应该通知网站负责人或是开发人员等
  //    可以通过程序调用第三方服务，发短信，发邮件
  // 3. 把错误消息发送到客户端 500 Server Internal Error
  res.status(500).send({
    error: err.message
  });
});
```

然后在我们的路由处理中，如果有错误，就调用 next 函数传递错误对象，例如

```js
rouget.get("xxx", (req, res, next) => {
  xxx操作;
  if (err) {
    // 调用 next，传递 err 错误对象
    return next(err);
  }
});
```

### 使用 errorhandler 美化错误输出页面

npm i errorhandler

##### 配置

```js
const errorhandler = require('errorhandler')
// 后面讲发布部署的时候再将这种方式，不用修改代码，可以在程序的外部决定内部的执行逻辑 
if (process.env.NODE_ENV === 'development') {  app.use(errorhandler()) }
```

##### 也可以错误消息输出到系统通知

```js
...
var errorhandler = require('errorhandler')
var notifier = require('node-notifier')
...

if (process.env.NODE_ENV === 'development') {
  // only use in development
  app.use(errorhandler({log: errorNotification}))
}
// 将错误输出消息输出到系统通知
function errorNotification (err, str, req) {
  var title = 'Error in ' + req.method + ' ' + req.url

  notifier.notify({
    title: title,
    message: str
  })
}
```

## session

### 页面访问权限控制

```js
router.get("/admin", (req, res) => {
  const sessionUser = req.session.user;
  if (!sessionUser) {
    return res.redirect("/admin/login");
  }
  res.render("admin/index.html");
});
```

#### 利用中间件的方式来统一处理页面的登录状态校验

```js
/**
 * 统一控制后台管理系统的页面访问权限
 * 相当于为所有以 /admin/xxxxx 开头的请求设置了一道关卡
 */
app.use("/admin", (req, res, next) => {
  if (req.originalUrl === "/admin/login") {
    // 这里 next() 就会往后匹配调用到我们的那个能处理 /admin/login 的路由
    return next();
  }
  // 2. 其他页面都一律验证登录状态
  const sessionUser = req.session.user;
  if (!sessionUser) {
    return res.redirect("/admin/login");
  }
  // 这里调用 next 就是调用与当前请求匹配的下一个中间件路由函数
  // 例如，当前请求是 /admin/users ，则 next 会找到我们那个匹配 /admin/users 的路由去处理
  next();
});
```

为了好维护，建议将这种中间件处理封装到独立的模块中，这里我们把这个处理过程封装到了 `middlewares/check-login.js` 文件模块中

```js
module.exports = (req, res, next) => {
  // 所有以 /admin/ 开头的请求都会进入这个中间件
  // 1. 如果是 /admin/login 则直接允许通过
  if (req.originalUrl === "/admin/login") {
    return next();
  }

  // 2. 非 /admin/login 的页面都校验登录状态
  const sessionUser = req.session.user;
  // 2.1 如果没有则让其去登录
  if (!sessionUser) {
    return res.redirect("/admin/login");
  }

  // 2.2 如果登录了则让其通过
  next();
};
```

然后在 `app.js` 中挂载这个中间件

```js
const checkLogin = require('./middlewares/check-login.js')
app.use('/admin', checkLogin)
```

### 用户退出

```js
/**
 * 用户退出
 */
router.get("/admin/users/logout", (req, res) => {
  // 1. 清除登录状态
  delete req.session.user;

  // 2. 记录用户的退出时间

  // 2. 跳转到登录页
  res.redirect("/admin/login");
});
```



## Session 数据持久化

Session 数据持久化的目的是为了解决服务器重启或者崩溃挂掉导致的 Session 数据丢失的问题。

因为默认情况下 Session 数据是存储在内存中的，服务器一旦重启就会导致 Session 数据丢失。

所了我们为了解决这个问题，把 Session 数据存储到了数据库中。

npm i express-mysql-session

#### 配置

```js
...

const session = require('express-session')

/**
 * 配置 Session 数据持久化
 * 参考文档：https://github.com/chill117/express-mysql-session#readme
 * 该插件会自动往数据库中创建一个 sessions 表，用来存储 Session 数据
 */

const MySQLStore = require('express-mysql-session')(session)

const sessionStore = new MySQLStore({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '123456',
  database: 'alishow62'
})

const app = express()

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: sessionStore, // 告诉 express-session 中间件，使用 sessionStore 持久化 Session 数据
}))

...
```

### 展示当前登录用户信息

简单点就是在每一次 render 页面的时候，把 `req.session.user` 传到模板中去使用。

当你需要在多个模板中使用相同的模板数据的时候，每一次 render 传递就麻烦了。所以 express 提供了一种简单的方式，我们可以把模板中公用的数据放到 `app.locals` 中。`app.locals` 中的数据可以在模板中直接使用。

```js
app.use("/admin", checkLogin, (req, res, next) => {
  // 只有在 checkLogin 中 next 了，才会执行这个中间件
  app.locals.sessionUser = req.session.user;
  next();
});
```

![image-20211105104230657](C:\Users\HDR\AppData\Roaming\Typora\typora-user-images\image-20211105104230657.png)

#### 对称加解密：加解密使用的私钥必须一致。

##### 加密

```js
const crypto = require("crypto");
const cipher = crypto.createCipher("aes192", "私钥");

let encrypted = cipher.update("要加密的数据", "utf8", "hex");
encrypted += cipher.final("hex");
console.log(encrypted);
// Prints: ca981be48e90867604588e75d04feabb63cc007a8f8ad89b10616ed84d815504
```

##### 解密

```js
const crypto = require("crypto");
const decipher = crypto.createDecipher("aes192", "私钥");

const encrypted = "要解密的数据";
let decrypted = decipher.update(encrypted, "hex", "utf8");
decrypted += decipher.final("utf8");
console.log(decrypted);
// Prints: some clear text data
```

## 富文本编辑器 wangEditor

常见的富文本编辑器：

- [Ueditor](https://ueditor.baidu.com/website/)

- [CKeditor](https://ckeditor.com/)

- [Quill](https://quilljs.com/)

- [wangEditor](http://www.wangeditor.com/)

## 异步编程

封装 Promise 版本的 `readFile` ：

```js
function readFile(...args) {
  return new Promise((resolve, reject) => {
    fs.readFile(...args, (err, data) => {
      err ? reject(err) : resolve(data);
    });
  });
}

readFile("./data/a.txt", "utf8").then(data => {
  console.log(data);
});
```

示例：封装 Promise 版本的 ajax

```js
var ajax = {};

ajax.get = function(url) {
  return new Promise((resolve, reject) => {
    var oReq = new XMLHttpRequest();
    oReq.onload = function() {
      // callback(this.responseText)
      resolve(this.responseText);
    };
    oReq.open("get", url, true);
    oReq.send();
  });
};

function duquabc() {
  return new Promise((resolve, reject) => {
    let ret = "";
    ajax
      .get("./data/a.txt")
      .then(data => {
        ret += data;
        return ajax.get("./data/b.txt");
      })
      .then(data => {
        ret += data;
        return ajax.get("./data/c.txt");
      })
      .then(data => {
        ret += data;
        resolve(ret);
      });
  });
}

duquabc().then(ret => {
  console.log(ret);
});
```

