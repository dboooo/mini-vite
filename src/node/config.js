import path from 'path'
import fs from 'fs-extra'
import chalk from 'chalk'
import dotenv from 'dotenv'
import {lookupFile} from './utils/fsUtils'

const debug = require('debug')

export async function resolveConfig() {
    // 用来分析resolve花费的时间
    const start = Date.now()
    const cwd = process.cwd()

    let resolvedPath;
    // 得到vite.config.[jt]s的路径
    if (configPath) {
        resolvedPath = path.resolve(cwd, configPath)
    } else {
        const jsConfigPath = path.resolve(cwd,'vite.config.js')        
        if (fs.existsSync(jsConfigPath)) {
            resolvedPath = jsConfigPath
        } else {
            const tsConfigPath = path.resolve(cwd, 'vite.config.ts')
            if(tsConfigPath) {
                resolvedPath = tsConfigPath
            }
        }
    }

    if (!resolvedPath) {
        return {
            env: loadEnv(mode, cwd)
        }
    }

    const isTS = resolvedPath.endsWith('.ts')

    try {
        // 这里的userConfig 类型可以是UserConfig | 返回UserConfig类型的函数|undefined
        let userConfig

        if (!isTS) {
            try {
                userConfig = require(resolvedPath)
            } catch (err) {
                const ignored = /Cannot use import statement|Unexpected token 'export'|Must use import to load ES Module/
                if (!ignored.test(err.message)) {
                throw err
                }
            }
        }

        if (!userConfig) {
            // 初始化
        }
        
    } catch (err) {
        console.log(`vite failed to load the config from ${resolvedPath}`)
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
        const path = lookupFile(root, [file], true)

        const parsed = dotenv.parse(fs.readFileSync(path))

        for (const [key, value] of Object.entries(parsed)) {
            if (key.startsWith(prefix) && env[key] === undefined) {
              env[key] = value
            }
        }
    }

    return env
}