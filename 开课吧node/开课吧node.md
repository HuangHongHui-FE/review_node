## 开课吧node

##### promisify

![image-20211126203506009](%E5%BC%80%E8%AF%BE%E5%90%A7node.assets/image-20211126203506009.png)



##### buffer

![image-20211126203700318](%E5%BC%80%E8%AF%BE%E5%90%A7node.assets/image-20211126203700318.png)



![image-20211126203722739](%E5%BC%80%E8%AF%BE%E5%90%A7node.assets/image-20211126203722739.png)

![image-20211126203745723](%E5%BC%80%E8%AF%BE%E5%90%A7node.assets/image-20211126203745723.png)



Buffer.concat()

![image-20211126203912609](%E5%BC%80%E8%AF%BE%E5%90%A7node.assets/image-20211126203912609.png)





#### iconv库解码

持续剥去函数里的属性

![image-20211126204549415](%E5%BC%80%E8%AF%BE%E5%90%A7node.assets/image-20211126204549415.png)



### 流

```js
const fs = require("fs")
const rs = fs.createReadStream("./1.png")
const ws = fs.createWriteStream("./1.png")
rs.pipe(ws)
```

 

流结合http

![image-20211126205401277](%E5%BC%80%E8%AF%BE%E5%90%A7node.assets/image-20211126205401277.png)

![image-20211126205410562](%E5%BC%80%E8%AF%BE%E5%90%A7node.assets/image-20211126205410562.png)

