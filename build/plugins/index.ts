import vue from '@vitejs/plugin-vue'
// 这个插件可以保证在vue3+vite中，创建组件的时候可以使用tsx语法
import vueJsx from '@vitejs/plugin-vue-jsx'
import { type PluginOption } from 'vite'
/**
 * 插件的引入
 * */
export function creatPlugin ():PluginOption {
  const vitePlugins: PluginOption = [vue(), vueJsx()]
  return vitePlugins
}