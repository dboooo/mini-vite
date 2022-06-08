'use strict';

var compiler = require('@vue/compiler-sfc');

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n["default"] = e;
    return Object.freeze(n);
}

var compiler__namespace = /*#__PURE__*/_interopNamespace(compiler);

const Koa = require('koa');
const fs = require('fs');
const path = require('path');

const rewrite = require('../utils/index');

const app = new Koa();

app.use(async (ctx, next)=>{
    const { url } = ctx;
    const rootPath = process.cwd();
    if( url === '/' ) {
        ctx.type = 'text/html';
        ctx.body = fs.readFileSync(path.join(rootPath, './index.html'), 'utf8');
    } else if( url.endsWith('.js') ) {
        const p = path.join(rootPath, url);
        ctx.type = 'application/javascript';
        ctx.body = rewrite(fs.readFileSync(p, 'utf8'));
    } else if ( url.includes('/@modules') ) {
        const moduleName = url.replace(/@modules/,'');
        const prefix = path.join(rootPath, 'node_modules', '.pnpm', 'vue@3.2.36', 'node_modules', moduleName);
        const module = require(prefix+'/package.json').module;
        const ret = fs.readFileSync(path.join(prefix, module), 'utf8');

        ctx.type = 'application/javascript';
        ctx.body = rewrite(ret);
    } else if (url.endsWith('.vue')) {
        // 处理.vue文件
        const filePath = path.join(rootPath, url);
        const file = fs.readFileSync(filePath);
        ctx.type = 'application/javascript';
        ctx.body = compiler__namespace.parse(file);
    }
});

app.listen(8080,()=>{
    console.log('server is running on: http://localhost:8080');
});
