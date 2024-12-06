import { fileURLToPath, URL } from 'node:url'
import { defineAppConfig } from './build/config'

export default defineAppConfig({
  overrides: {
    resolve: {
      // 设置别名
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
})
