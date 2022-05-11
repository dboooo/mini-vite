const path = require('path')
const fs = require('fs')

export async function resolveConfig(mode, configPath) {
    const start = Date.now()
    const cwd = process.cwd()

    let resolvePath
    if (configPath) {
        resolveConfig = path.resolve(cwd, configPath)
    } else {
        const jsConfigPath = path.resolve(cwd,'vite.config.js')        
        if (fs.existsSync(jsConfigPath)) {
            resolvePath = jsConfigPath
        } else {
            const tsConfigPath = path.resolve(cwd, 'vite.config.ts')
            if(tsConfigPath) {
                resolvePath = tsConfigPath
            }
        }

        if (!resolvePath) {
            return {
                env: loadEnv(mode, cwd)
            }
        }

        const isTS = resolvePath.endsWith('.ts')

        try {
            // 这里的userConfig 类型可以是UserConfig | 返回UserConfig类型的函数|undefined
            let userConfig

            if (!isTS) {
                try {
                    userConfig = require(resolvePath)
                } catch (err) {
                    
                }
            }

            if (!userConfig) {
                // 初始化
            }
            
        } catch (err) {
            console.log(`vite failed to load the config from ${resolvePath}`)
            console.error(err)
            process.exit(1)
        }
    }
}