单例   封装操作mongodb

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

