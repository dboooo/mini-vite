import path from 'path'
import fs from 'fs-extra'
import chalk from 'chalk'

export function lookupFile ( dir,formats,pathOnly ) {
    for (const format of formats) {
        const fullPath = path.join(dir, format)
        if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
            return pathOnly ? fullPath: fs.readFileSync(fullPath, 'utf-8')
        }
    }
    // 获取上一层目录
    const parentDir = path.dirname(dir)
    if (parentDir !== dir) {
        return lookupFile(parentDir, formats, pathOnly)
    }
}