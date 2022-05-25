// 设置静态资源匹配正则
const imageRE = /\.(png|jpe?g|gif|svg|ico|webp)(\?.*)?$/
const mediaRE = /\.(mp4|webm|ogg|map3|wav|flac|acc)(\?.*)?$/
const fontsRE = /\.(woff2?|eot|ttf|otf)(\?.*)?$/i

export const isImportRequest = (ctx) => {
    return ctx.query.import != null
}

/**
 * Check if a file is a static asset that vite can process.
 */
export const isStaticAsset = (file) => {
    return imageRE.test(file) || mediaRE.test(file) || fontsRE.test(file)
}