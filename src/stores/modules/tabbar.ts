import { defineStore } from 'pinia'
import type { RouteLocationNormalized } from 'vue-router'

interface TabBarState {
    tabs: RouteLocationNormalized[]; // 当前打开的标签页列表
    updateTime: number; // 更新时间，用于一些更新场景，使用watch深度监听的话，会损耗性能
}
export const useTabBarStore = defineStore({
  id: 'app-tabbar',
  state: (): TabBarState => ({
    tabs: [],
    updateTime: Date.now()
  }),
  getters: {
    getTabs (): RouteLocationNormalized[] {
      return [...this.tabs]
    }
  },
  actions: {
    /**
     * 添加标签页
     * */
    addTab (routeTab: RouteLocationNormalized) {
      const tabIndex = this.tabs.findIndex((tab) => {
        return getTabPath(tab) === getTabPath(routeTab)
      })

      // 如果没有就新增一个选项卡
      if (tabIndex === - 1) {
        this.tabs.push(routeTab)
      } else {
        // 如果已经有该选项卡就更新原选项卡数据
      }
    }
  },
  persist: [
    // tabs保存在sessionStorage
    {
      pick: ['tabs'],
      storage: sessionStorage
    }
  ]
})
/**
 * 获取标签页路径
 * @param tab
 */
function getTabPath (tab: RouteLocationNormalized) {
  return decodeURIComponent(tab.fullPath || tab.path)
}
