// beforeEach的第三个参数next，如果接收了就必须要调用，否则会报错
// 官网已经不建议用第三个next参数了
// router.beforeEach的回调函数的返回值如果是undefined，或者return true，
// 它会正常跳转to，要去的路由地址
// 如果同时调用多个beforeEach，他会调用下一个导航守卫
// router.beforeEach的回调函数的返回值如果是一个路由地址，
// 那它会跳转至这个路由地址
import { startProgress, stopProgress } from '@/utils/nprogress'
import { usePermissionStore } from '@/stores/modules/permission'
import { generateAccess } from './access'
import type { Router } from 'vue-router'

/**
 * 通用的守卫配置
 * */
function setupCommonGuard (router: Router) {
  router.beforeEach(async (to) => {
    // 页面加载进度条
    await startProgress()
    return true
  })
  router.afterEach(async (to) => {
    await stopProgress()
  })
}
/**
 * 权限访问守卫配置
 * */
function setupAccessGuard (router: Router) {
  router.beforeEach(async (to, from ) => {
    const permissionStore = usePermissionStore()
    // 已经获取过权限菜单
    if (permissionStore.isAccessChecked) {
      // 如果访问的是根路径
      if (to.path === '/') {
        // 跳转到第一个菜单
        return {
          path: permissionStore.accessRoutes[0].path
        }
      } else {
        // 如果访问的是其他路径，正常跳转
        return true
      }
    }
    /**
     * 生成权限菜单和路由
     * accessibleRoutes：权限路由
     * accessibleMenus：权限菜单
     * */
    const { accessibleMenus, accessibleRoutes } = await generateAccess()
    // 保存菜单信息和路由信息到store
    permissionStore.setAccessRoutes(accessibleRoutes)
    permissionStore.setAccessMenus(accessibleMenus)
    permissionStore.setIsAccessChecked(true)

    if (to.path === '/') {
      return {
        path: permissionStore.accessRoutes[0].path,
        replace: true
      }
    } else {
      return {
        path: to.fullPath,
        replace: true
      }
    }
  })
}

export function createRouterGuard (router: Router) {
  /** 通用 */
  setupCommonGuard(router)
  /** 权限访问 */
  setupAccessGuard(router)
}