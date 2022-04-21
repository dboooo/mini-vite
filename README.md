# mini-vite

## vite插件
    vite插件。
    插件可以是：rollup-plugin或者vite-plugin
    取决于你插件用的是纯vite特有钩子or rollup-plugin

-- 那么在vite.config.js中应该这么写:
'''
    // vite.config.js
    import vitePlugin from 'vite-plugin-feature'
    import rollupPlugin from 'rollup-plugin-feature'

    export default defineConfig({
    plugins: [vitePlugin(), rollupPlugin()]
    })
'''