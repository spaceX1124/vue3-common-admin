import { defineConfig, mergeConfig, type UserConfig } from 'vite'
import { creatPlugin } from '../plugins'
import { resolve } from 'path'

interface DefineOptions {
    overrides?: UserConfig
}
export function defineAppConfig<T extends DefineOptions> (defineOptions: T ) {
  const { overrides } = defineOptions
  const common: UserConfig = {
    root: process.cwd(), // E:\web\vue3-admin
    base: './', // 开发或生产环境服务的公共基础路径
    server: {
      port: 8088,
      open: false
    }
    // css: {
    //   preprocessorOptions: {
    //     // scss: {
    //     //   modifyVars: {
    //     //     // 在某些情况下，LESS 的某些功能可能会受到限制，hack: true; 可以用来启用特定的兼容模式，使得 LESS 能够更好地工作
    //     //     hack: `true; @import (reference) "${resolve('./src/design/config.less')}"`
    //     //   },
    //     //   javascriptEnabled: true,
    //     // },
    //     scss: {
    //       additionalData: `
    //       @import "@/designs/index.ts";
    //      `
    //     }
    //   }
    // }
  }
  return defineConfig(({ mode }: UserConfig) => {
    console.log(mode, 'mode')
    const plugins = creatPlugin()
    const defaultConfig = {
      plugins
    }
    const config = mergeConfig(defaultConfig, common)
    return overrides ? mergeConfig(config, overrides) : config
  })
}