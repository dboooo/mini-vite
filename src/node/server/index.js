import Koa from 'koa'

export function createServer (config) {
    const app = new Koa()
    const server = resolveServer(config, app.callback())
}

function resolveServer(
    { https = false, httpsOptions = {}, proxy},
    requestListener
) {
    
}