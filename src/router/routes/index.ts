import type { RouteRecordRaw } from 'vue-router'
const Layouts = () => import('@/components/Layouts/index.vue')

// 引入模块下的路由
const dynamicRouteFiles = import.meta.glob('./modules/**/*.ts', {
  eager: true
})
/** 动态路由 */
const dynamicRoutes: RouteRecordRaw[] = mergeRouteModules(dynamicRouteFiles) // 取default默认导出的数据

const basicRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Root',
    component: Layouts,
    meta: {
      title: 'Root'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/:path(.*)*',
    name: 'NotFound',
    component: () => import('@/views/fallback/notFound/index.vue'),
    meta: {
      title: '404'
    }
  }
]
export { basicRoutes, dynamicRoutes }

/**
 * 合并动态路由模块的默认导出
 * @param routeModules 动态导入的路由模块对象
 * @returns 合并后的路由配置数组
 */
// 定义模块类型
interface RouteModuleType {
  default: RouteRecordRaw[];
}
function mergeRouteModules (
  routeModules: Record<string, unknown>
): RouteRecordRaw[] {
  const mergedRoutes: RouteRecordRaw[] = []

  for (const routeModule of Object.values(routeModules)) {
    const moduleRoutes = (routeModule as RouteModuleType)?.default ?? []
    mergedRoutes.push(...moduleRoutes)
  }

  return mergedRoutes
}