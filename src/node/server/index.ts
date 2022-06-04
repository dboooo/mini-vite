interface Ctx {
    url: string,
    type: string,
    body: any
}

import Koa from 'koa'
import fs from 'fs'
import path from 'path'

import rewrite from '../utils'

const app = new Koa()

app.use(async (ctx: Ctx, next)=>{
    const { url } = ctx
    const rootPath = process.cwd()
    if( url === '/' ) {
        ctx.type = 'text/html'
        ctx.body = fs.readFileSync(path.join(rootPath, './index.html'), 'utf8')
    } else if( url.endsWith('.js') ) {
        const p = path.join(rootPath, url)
        ctx.type = 'application/javascript'
        ctx.body = rewrite(fs.readFileSync(p, 'utf8'))
    } else if ( url.includes('@modules') ) {
        const module = url.slice(url.indexOf('@modules')+9)
        const filePath = path.join(rootPath, `node_modules/${module}/dist`)

        ctx.type = 'application/javascript'
        ctx.body = fs.readFileSync(filePath)
    }
})

app.listen(3000,()=>{
    console.log('server is running on: http://localhost:3000')
})