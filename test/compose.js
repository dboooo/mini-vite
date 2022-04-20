const Compose = require('../compose')

let middleware = []

middleware.push(
    () =>{
        console.log('wotule-----------11111')
    }
)

let result = Compose(middleware)
