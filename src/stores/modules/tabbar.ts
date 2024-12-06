import { defineStore } from 'pinia'
import type { RouteLocationNormalized, Router } from 'vue-router'

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
    },
    /**
     * @zh_CN 通过key关闭标签页
     * @param key
     * @param router
     */
    async closeTabByKey (key: string, router: Router) {
      const originKey = decodeURIComponent(key)
      const index = this.tabs.findIndex(
        (item) => getTabPath(item) === originKey
      )
      if (index === -1) {
        return
      }

      const tab = this.tabs[index]
      if (tab) {
        await this.closeTab(tab, router)
      }
    },
    /**
     * 点击关闭标签页
     */
    async closeTab (tab: RouteLocationNormalized, router: Router) {
      const { currentRoute } = router
      // 关闭的不是激活的选项卡
      if (getTabPath(currentRoute.value) !== getTabPath(tab)) {
        this._close(tab)
        return
      }
      const index = this.getTabs.findIndex(
        (item) => getTabPath(item) === getTabPath(currentRoute.value)
      )

      const before = this.getTabs[index - 1]
      const after = this.getTabs[index + 1]

      // 下一个tab存在，跳转到下一个
      if (after) {
        this._close(tab)
        await this._goToTab(after, router)
        // 上一个tab存在，跳转到上一个
      } else if (before) {
        this._close(tab)
        await this._goToTab(before, router)
      } else {
        console.error('Failed to close the tab; only one tab remains open.')
      }
    },
    /**
     * @zh_CN 跳转到标签页
     * @param tab
     * @param router
     */
    async _goToTab (tab: RouteLocationNormalized, router: Router) {
      const { params, path, query } = tab
      const toParams = {
        params: params || {},
        path,
        query: query || {}
      }
      await router.replace(toParams)
    },
    /**
     * 处理关闭标签页
     */
    _close (tab: RouteLocationNormalized) {
      const { fullPath } = tab
      const index = this.tabs.findIndex((item) => item.fullPath === fullPath)
      index !== -1 && this.tabs.splice(index, 1)
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
