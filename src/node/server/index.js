const Koa = require('koa')
const fs = require('fs')
const path = require('path')

const rewrite = require('../utils/index')

const app = new Koa()

app.use(async (ctx, next)=>{
    console.log(ctx.body);
    const { url } = ctx
    const rootPath = process.cwd()
    if( url === '/' ) {
        ctx.type = 'text/html'
        ctx.body = fs.readFileSync(path.join(rootPath, './index.html'), 'utf8')
    } else if( url.endsWith('.js') ) {
        const p = path.join(rootPath, url)
        ctx.type = 'application/javascript'
        ctx.body = rewrite(fs.readFileSync(p, 'utf8'))
    } else if ( url.includes('/@modules') ) {
        const moduleName = url.replace(/@modules/,'')
        const prefix = path.join(rootPath, 'node_modules', '.pnpm', 'vue@3.2.36', 'node_modules', moduleName)
        const module = require(prefix+'/package.json').module
        const ret = fs.readFileSync(path.join(prefix, module), 'utf8')

        ctx.type = 'application/javascript'
        ctx.body = rewrite(ret)
    }
})

app.listen(8080,()=>{
    console.log('server is running on: http://localhost:8080')
})