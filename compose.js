/**
 * 
 * @param {Array} middlware 
 * @returns 
 */


module.exports =  function Compose (middlware) {
    if (!Array.isArray(middlware)) {
        throw new Error ('Middleware must be an Array!')
    }
    return function (ctx,next) {
        let index = -1

        return dispatch(0)

        function dispatch (i) {
            if(i<index) {
                return Promise.reject(new Error('next() called 2次'))
            }
            index = i
            
            let fn = middlware[i]

            if(i === middlware.length) {
                fn = next
            }

            if(!fn) {
                return Promise.resolve()
            }

            try {
                return Promise.resolve(
                    fn(ctx,()=>{return dispatch(i+1)})
                )
            } catch (err) {
                return Promise.reject(err)
            }
        }
    }
}

// 做了这些事，收集middleware，
// 返回一个函数，执行这个函数
// 就会开始递归middleware
// 每次返回一个Promise对象，
// 并且立即执行添加到middleware中的fn
// 这个fn接受两个参数:ctx,next函数(就是dispatch)。

