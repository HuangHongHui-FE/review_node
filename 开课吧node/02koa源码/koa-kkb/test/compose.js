// 实现功能将这两个函数合成起来
const add = (x, y) => x + y
const square = z => z * z


// const fn = (x, y) => square(add(x, y));

// // 实现 , 利用高阶函数
// const compose = (fn1, fn2) => (...args) => fn2(fn1(...args));  // 先输入的放里面


// const fn = compose(add, square)

// console.log(fn(1, 2))




// // 合并多个函数

// const compose = (...[first, ...other]) => (...args) => {
//     let ret = first(...args)
//     other.forEach(fn => {
//         ret = fn(ret)
//     })

//     return ret
// }

// const fn = compose(add, square, square)

// console.log(fn(1, 2));





// 实现洋葱圈函数执行顺序

function compose(middlewares) {
    return function() {
        return dispatch(0)  // 下标表示执行第几个函数
        function dispatch(i) {
            let fn = middlewares[i]
            if(!fn) {
                return Promise.resolve()
            }
            return Promise.resolve(
                fn(function next() {
                    return dispatch(i + 1);
                })
            )
        }
    }
}


async function fn1(next) {
    console.log('fn1')
    await next()
    console.log('end fn1')
}


async function fn2(next) {
    console.log('fn2')
    await delay()
    await next()
    console.log('end fn2')
}

function fn3 (next) {
    console.log(fn3)
}

function delay() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 2000);
    })
}