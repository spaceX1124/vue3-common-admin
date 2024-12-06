import { createApp } from 'vue'

import '@/designs'

import App from './App.vue'
import router from './router'
import { initStores } from '@/stores'

const app = createApp(App)
// @todo，暂时随便写一下，后期优化一下，命名空间的前缀
const namespace = 'zs'
initStores(app, { namespace })
app.use(router)

app.mount('#app')
