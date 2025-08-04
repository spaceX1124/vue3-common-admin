import { createApp } from 'vue'

import '@/designs'
// 引入element-plus的样式，如果是其他UI框架，可以对应更改
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import { initStores } from '@/stores'
// import '@/utils/mock.ts'
import { initComponentAdapter }from '@/adapter/component'

import { ls } from '@/utils/cache/storageCache.ts'
import { cacheUserInfo } from '@/libs/constants.ts'

const app = createApp(App)
bootstrap()
app.use(router)
app.use(ElementPlus, { locale: zhCn })

app.mount('#app')

function bootstrap () {
  // 初始化组件适配器
  initComponentAdapter()
  // @todo，暂时随便写一下，后期优化一下，命名空间的前缀
  const namespace = 'zs'
  initStores(app, { namespace })
}
//
// ls.set(cacheUserInfo, {
//   token: 'K2FhemJ2UnlHYjR6Q3d1TDVOVFNtMm1qTGhIbzZMR2tnN2RtcGQzemVHSzBNc2dRRFUzdVdkMklXQW5LRDRTMA'
// })
