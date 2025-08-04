import { defineStore } from 'pinia'
import type { MenuRecordRaw } from '@/packages/ui/menus'
import type { RouteRecordRaw } from 'vue-router'

interface PermissionState {
    accessMenus: MenuRecordRaw[]; // 可访问的菜单列表
    accessRoutes: RouteRecordRaw[]; // 可访问的路由列表
    isAccessChecked: boolean; // 是否已经检查过权限
}

/**
 * 存储菜单
 * 存储权限检查状态
 * */
export const usePermissionStore = defineStore({
  id: 'app-permission',
  state: (): PermissionState => ({
    accessMenus: [], // 可访问的菜单列表
    accessRoutes: [], // 可访问的路由列表
    isAccessChecked: false // 是否已经检查过权限
  }),
  actions: {
    setAccessMenus (menus: MenuRecordRaw[]) {
      this.accessMenus = menus
    },
    setAccessRoutes (routes: RouteRecordRaw[]) {
      this.accessRoutes = routes
    },
    setIsAccessChecked (isAccessChecked: boolean) {
      this.isAccessChecked = isAccessChecked
    }
  }
})