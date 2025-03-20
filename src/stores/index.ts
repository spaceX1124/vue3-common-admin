import { createPersistedState } from 'pinia-plugin-persistedstate'
import { createPinia, type Pinia } from 'pinia'
import type { App } from 'vue'

export interface InitStoreOptions {
    namespace: string;
}
/**
 * @zh_CN 初始化pinia
 */
let pinia: Pinia
export function initStores (app: App, options: InitStoreOptions) {
  pinia = createPinia()
  const { namespace } = options
  // store持久化
  pinia.use(
    createPersistedState({
      // key $appName-$store.id
      key: (storeKey) => `${namespace}-${storeKey}`,
      storage: localStorage
    })
  )
  app.use(pinia)
  return pinia
}