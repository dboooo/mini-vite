import { createApp, h } from 'vue'

window.process = {
    env: {
        NODE_ENV: 'development'
    }
}

createApp({}).mount('#app')
