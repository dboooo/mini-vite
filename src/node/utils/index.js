module.exports =  function rewrite (ctx) {
    return ctx.replace(/ from ['"](.*)['"]/g,(s1, s2)=>{
        if (s2.startsWith('/') || s2.startsWith('./') || s2.startsWith('../')) {
            return s1
        } else {
            return ` from '/@modules/${s2}'`
        }
    })
}