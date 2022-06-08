const Koa = require('koa')
const fs = require('fs')
const path = require('path')
const compiler = require('@vue/compiler-sfc')
const hash = require('hash.js')

const rewrite = require('../utils/index')

const app = new Koa()

app.use(async (ctx, next)=>{
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
        const prefix = path.join(rootPath, 'node_modules', moduleName)
        const module = require(prefix+'/package.json').module
        const ret = fs.readFileSync(path.join(prefix, module), 'utf8')

        ctx.type = 'application/javascript'
        ctx.body = rewrite(ret)
    } else if (url.endsWith('.vue')) {
        // 处理.vue文件
        const filePath = path.join(rootPath, url)
        const file = fs.readFileSync(filePath,'utf8')
        const id = Object.toString(hash.sha256().h[0])
        const dataVId = 'data-v-' + id
        const parseResult = compiler.parse(file)
        const descriptor = parseResult.descriptor
        const hasScoped = descriptor.styles.some((s) => s.scoped);

        const tqlCode = compiler.compileTemplate({
            id: id,
            source: descriptor.template.content,
            scoped: hasScoped,
            compilerOptions: {
                scopeId: hasScoped ? dataVId:  undefined
            }
        }).code

        const sCode = compiler.compileScript(descriptor, {
            id: id,
            templateOptions: {
                scoped: hasScoped,
                compilerOptions: {
                scopeId: hasScoped ? dataVId : undefined,
                }
            },
        }).content
        const styles = descriptor.styles

        ctx.type = 'application/javascript'
        ctx.body = `
            // template
            ${rewrite(tqlCode)}
            // script
            ${rewrite(sCode)}
        `
    }
})

app.listen(8080,()=>{
    console.log('server is running on: http://localhost:8080')
})