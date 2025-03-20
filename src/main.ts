import { createApp } from 'vue'

import '@/designs'
// 引入element-plus的样式，如果是其他UI框架，可以对应更改
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import { initStores } from '@/stores'
import '@/utils/mock.ts'
import { initComponentAdapter }from '@/adapter/component'

const app = createApp(App)
bootstrap()
app.use(router)

app.mount('#app')

function bootstrap () {
  // 初始化组件适配器
  initComponentAdapter()
  // @todo，暂时随便写一下，后期优化一下，命名空间的前缀
  const namespace = 'zs'
  initStores(app, { namespace })
}
