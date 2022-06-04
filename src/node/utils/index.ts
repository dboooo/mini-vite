export default function rewrite (ctx: string):string {
    return ctx.replace(/ from ['"](.*)['"]/g,(s1:string, s2:string)=>{
        if (s2.startsWith('/') || s2.startsWith('./') || s2.startsWith('../')) {
            return s1
        } else {
            return ` from @modules/${s1}`
        }
    })
}