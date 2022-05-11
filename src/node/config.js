const path = require('path')
const fs = require('fs')

export async function resolveConfig(/*默认为dev*/mode, configPath) {
    // 用来分析resolve花费的时间
    const start = Date.now()
    const cwd = process.cwd()

    let resolvePath
    // 得到vite.config.[jt]s的路径
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

export function loadEnv (mode, root, prefix="VITE_") {
    if (mode === 'local') {
        throw new Error (
            `"local" cannot be used as a mode name because it conflicts with ` +
            `the .local postfix for .env files.`
        )
    }

    const env = {}
    const envFiles = [
    /** mode local file */ `.env.${mode}.local`,
    /** mode file */ `.env.${mode}`,
    /** local file */ `.env.local`,
    /** default file */ `.env`
    ]

    for (const file of envFiles) {
        
    }


    return env
}