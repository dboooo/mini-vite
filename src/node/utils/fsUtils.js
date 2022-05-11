const path = require('path')
const fs = require('fs')

console.log(fs.statSync(process.cwd()).isFile());

module.exports = function lookupFile (
    dir,
    formats,
    pathOnly = false
) {
    for (const format of formats) {
        const fullPath = path.join(dir, format)
        if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
            return pathOnly ?fullPath: fs.readFileSync(fullPath, 'utf-8')
        }
    }
    const parentDir = path.dirname(dir)
    if (parentDir !== dir) {
        return lookupFile(parentDir, formats, pathOnly)
    }
}