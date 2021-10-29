var fs = require('fs')
var Student = require('./student')  // 引出数据操作模块

// express提供了一种方式专门用来包装路由的
var express = require('express')

// 1. 创建一个路由容器
var router = express.Router()

// 2. 把路由挂载到 router 路由容器中
router.get('/students', function(req, res) {
    // 读取文件(数据处理这一段封装到了student中)
    // readFile 的第二个参数是可选的， 传入utf8 就是告诉他把读取到的文件直接按照utf8编码转成我们能认识的字符
    // 除了这样转换以外， 也可以通过data.toString() 的方式
    /*fs.readFile('./db.json', 'utf8', function(err, data) {
        if (err) {
            return res.status(500).send('Server error.')
        }

        // 从文件中读取到的为字符串, 这里要手动转换成对象
        var students = JSON.parse(data).students  // JSON.parse(data)将data转成对象

        *//*console.log(data)*//*
        res.render('index.html', {
            fruits: [
                '苹果',
                '香蕉',
                '桔子'
            ],
            students: students
        })
    })*/


    Student.find(function(err, students){
        if (err) {
            return res.status(500).send('Server error.')
        }
        res.render('index.html', {
            fruits: [
                '苹果',
                '香蕉',
                '桔子'
            ],
            students: students
        })
    })
})


router.get('/students/new', function(req, res) {
    res.render('new.html')
})
router.post('/students/new', function(req, res) {
    // 1 获取表单数据
    // 2 处理
        // 将数据保存到db.json文件中用以持久化
    // 3 发送响应
        // 先读取出来，转成对象
        // 然后往对象中push数据
        // 然后把对象转化成字符串
        // 然后把字符串再次写入文件
    console.log(req.body)
    Student.save(req.body, function (err) {
        if (err) {
            // console.log('hahahah')
            return res.status(500).send('Server error.')
        }
        // console.log('aaaaaa')
        res.redirect('/students')
    })
})

router.get('/students/1', function(req, res) {

})


// 3. 把 router 导出
module.exports = router



// 这样还是不够方便
/*
module.exports = function (app) {
    app.get('/', function(req, res) {
        // 读取文件
        // readFile 的第二个参数是可选的， 传入utf8 就是告诉他把读取到的文件直接按照utf8编码转成我们能认识的字符
        // 除了这样转换以外， 也可以通过data.toString() 的方式
        fs.readFile('./db.json', 'utf8', function(err, data) {
            if (err) {
                return res.status(500).send('Server error.')
            }

            // 从文件中读取到的为字符串
            // 这里要手动转换成对象
            var students = JSON.parse(data).students  // JSON.parse(data)将data转成对象

            console.log(data)
            res.render('index.html', {
                fruits: [
                    '苹果',
                    '香蕉',
                    '桔子'
                ],
                students: students
            })
        })

    })
}*/





// /**
//  * router.js路由模块
//  * 职责：
//  *      处理路由
//  *      根据不同的请求方法+请求路径设置具体的请求函数
//  * 模块职责要单一，我们划分模块的目的就是增强代码的可维护性，提升开发效率
//  */
// var fs = require('fs');

// // Express专门提供了一种更好的方式
// // 专门用来提供路由的
// var express = require('express');
// // 1 创建一个路由容器
// var router = express.Router();
// // 2 把路由都挂载到路由容器中

// router.get('/students', function(req, res) {
//     // res.send('hello world');
//     // readFile的第二个参数是可选的，传入utf8就是告诉他把读取到的文件直接按照utf8编码，直接转成我们认识的字符
//     // 除了这样来转换，也可以通过data.toString（）来转换
//     fs.readFile('./db.json', 'utf8', function(err, data) {
//         if (err) {
//             return res.status(500).send('Server error.')
//         }
//         // 读取到的文件数据是string类型的数据
//         // console.log(data);
//         // 从文件中读取到的数据一定是字符串，所以一定要手动转换成对象
//         var students = JSON.parse(data).students;
//         res.render('index.html', {
//             // 读取文件数据
//             students:students
//         })
//     })
// });

// router.get('/students/new',function(req,res){
//     res.render('new.html')
// });

// router.get('/students/edit',function(req,res){
    
// });

// router.post('/students/edit',function(req,res){
    
// });

// router.get('/students/delete',function(req,res){
    
// });

// // 3 把router导出
// module.exports = router;