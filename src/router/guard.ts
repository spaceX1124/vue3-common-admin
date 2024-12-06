// beforeEach的第三个参数next，如果接收了就必须要调用，否则会报错
// 官网已经不建议用第三个next参数了
// router.beforeEach的回调函数的返回值如果是undefined，或者return true，
// 它会正常跳转to，要去的路由地址
// 如果同时调用多个beforeEach，他会调用下一个导航守卫
// router.beforeEach的回调函数的返回值如果是一个路由地址，
// 那它会跳转至这个路由地址
import type { Router } from 'vue-router'
import { startProgress, stopProgress } from '@/utils/nprogress'
import { usePermissionStore } from '@/stores/modules/permission'
import { generateAccess } from './access'
import { dynamicRoutes } from './routes'

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
    // 已经检查过权限
    if (permissionStore.isAccessChecked) {
      if (to.path === '/') {
        return {
          path: permissionStore.accessRoutes[0].path
        }
      }
      return true
    }
    // 处理权限菜单
    const { accessibleMenus, accessibleRoutes } = await generateAccess({
      router,
      routes: dynamicRoutes
    })
    // 保存菜单信息和路由信息
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