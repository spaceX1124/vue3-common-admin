import type { Component } from 'vue'
import type { AccessModeType } from '@/types/preferences'
import { preferences } from '@/preferences'
import type { Router, RouteRecordRaw } from 'vue-router'
const Layouts = () => import('@/components/layouts/Layouts.vue')
import { cloneDeep } from '@/utils/tools'
import { filterTree, mapTree } from '@/utils/tree'
import type { MenuRecordRaw } from '@/packages/Menus'
import { http } from '@/utils/http'

type ComponentRecordType = Record<string, () => Promise<Component>>;
interface GenerateMenuAndRoutesOptions {
  pageMap?: ComponentRecordType;
  router: Router;
  routes: RouteRecordRaw[]; // 对于做后端路由来说没用
}

/**
 * 处理可访问的路由
 * */
async function generateAccess (options: GenerateMenuAndRoutesOptions) {
  // 加载所有的.vue组件
  const pageMap: ComponentRecordType = import.meta.glob('../views/**/*.vue')
  return await generateAccessible(preferences.app.accessMode, {
    ...options,
    pageMap
  })
}

async function generateAccessible (
  mode: AccessModeType,
  options: GenerateMenuAndRoutesOptions
) {
  const { router } = options
  // 拷贝一份写死的路由信息数据
  options.routes = cloneDeep(options.routes)
  // 生成路由
  const accessibleRoutes = await generateRoutes(mode, options)
  // 动态添加到router实例内
  accessibleRoutes.forEach((route) => {
    router.addRoute(route)
  })
  // 生成菜单
  const accessibleMenus = await generateMenus(accessibleRoutes, options.router)
  return { accessibleMenus, accessibleRoutes }
}

/**
 * Generate routes
 * @param mode
 * @param options
 */
async function generateRoutes (
  mode: AccessModeType,
  options: GenerateMenuAndRoutesOptions
): Promise<RouteRecordRaw[]> {
  const { routes, pageMap = {} } = options
  let resultRoutes: RouteRecordRaw[] = routes
  switch (mode) {
    case 'backend': {
      resultRoutes = await generateRoutesByBackend(options)
      break
    }
    case 'frontend': {
      resultRoutes = await generateRoutesByFrontend(routes )
      break
    }
  }
  /**
   * 调整路由树，做以下处理：
   * 1. 对未添加redirect的路由添加redirect
   */
  const normalizePageMap: ComponentRecordType = {}
  // 把相对路径key转成绝对路径key，并去除views，如../views/examples/form/basic/AddForm.vue =》 /examples/form/basic/AddForm.vue
  for (const [key, value] of Object.entries(pageMap)) {
    normalizePageMap[normalizeViewPath(key)] = value
  }
  resultRoutes = mapTree(resultRoutes, (route, parent, level) => {
    if (level === 0) {
      if((!route.children || !route.children.length)) {
        // 需要手动
        if (normalizePageMap[route.path]) {
          route.children = [
            {
              path: route.path + '/index',
              name: String(route.name) + 'Index',
              component: normalizePageMap[route.path],
              meta: {
                ...route.meta,
                hideInMenu: true
              }
            }
          ]
        }
      }
    }

    // 如果有redirect或者没有子路由，则直接返回
    if (route.redirect || !route.children || route.children.length === 0) {
      return route
    }
    const firstChild = route.children[0]

    route.redirect = firstChild.path
    return route
  })
  return resultRoutes
}

/**
 * 根据 routes 生成菜单列表
 * @param routes
 * @param router
 */
async function generateMenus (
  routes: RouteRecordRaw[],
  router: Router
): Promise<MenuRecordRaw[]> {
  // 将路由列表转换为一个以 name 为键的对象映射
  // 获取所有router最终的path及name
  const finalRoutesMap: { [key: string]: string } = Object.fromEntries(
    router.getRoutes().map(({ name, path }) => [name, path])
  )
  // 生成菜单原始数据
  let menus = mapTree<RouteRecordRaw, MenuRecordRaw>(routes, (node) => {
    // 路由表的路径写法有多种，这里从router获取到最终的path并赋值
    const path = finalRoutesMap[node.name as string] ?? node.path
    const { meta, name, children } = node
    const { icon, title, order, hideInMenu } = meta || {}
    // 出现的问题在于，要求返回的类型是MenuRecordRaw，但是从RouteRecordRaw类型数据中拿到的值的类型不能匹配上
    // 针对meta这个属性，让它继承了自定义的接口，参考.env.d.ts
    // 其余的属性通过as来解决
    return {
      icon,
      title: (title || node.name) as string,
      order,
      name: name as string,
      path,
      show: !hideInMenu,
      children: (children || []) as MenuRecordRaw[]
    }
  })

  // 对菜单进行排序
  menus = menus.sort((a, b) => (a.order || 999) - (b.order || 999))
  // 过滤路由，不用出现在菜单上
  return filterTree<MenuRecordRaw>(menus, (menu) => {
    return !!menu.show
  })
}

/**
 * 动态生成路由 - 后端方式
 */
async function generateRoutesByBackend (
  options: GenerateMenuAndRoutesOptions
): Promise<RouteRecordRaw[]> {
  const { pageMap = {} } = options
  /**
   * 菜单配置要求,这是可以人为控制的，只要按照这个要求就没问题
   * 文件路径严格按照path的命名，多层级嵌套：如/examples/form/basic/AddForm.vue
   * [
   *     {
   *         title: '示例',
   *         path: '/examples',
   *         name: 'Examples'
   *         ...
   *         children: [
   *             {
   *                 title: '表单',
   *                 path: '/examples/form',
   *                 name: 'ExamplesForm'
   *                 ...
   *                 children: [
   *                     {
   *                         title: '基础表单',
   *                         path: '/examples/form/basic',
   *                         name: 'ExamplesFormBasic'
   *                         ...
   *                     }
   *                 ]
   *             }
   *         ]
   *     },
   *     {
   *         title: '首页',
   *         path: '/home'
   *         ...
   *     }
   * ]
   * */
  try {
    // 获取权限范围内数据
    // const menuRoutes = await fetchMenuListAsync?.()
    const menuRoutes: MenuRecordRaw[] = await http.post('/api/getMenuList')
    if (!menuRoutes) {
      return []
    }
    const normalizePageMap: ComponentRecordType = {}
    // 把相对路径key转成绝对路径key，并去除views，如../views/examples/form/basic/AddForm.vue =》 /examples/form/basic/AddForm.vue
    for (const [key, value] of Object.entries(pageMap)) {
      normalizePageMap[normalizeViewPath(key)] = value
    }
    return convertRoutes(menuRoutes, normalizePageMap)
  } catch (error) {
    console.error(error)
    return []
  }
}
function convertRoutes (
  routes: MenuRecordRaw[],
  pageMap: ComponentRecordType
): RouteRecordRaw[] {
  // 为了保证不会出现找不到路由对应的文件地址，先拿到所有的vue地址（normalizePageMap），
  // 再通过拼接链式name，去匹配normalizePageMap对应的文件地址
  return mapTree<MenuRecordRaw, RouteRecordRaw>(routes, (node, parent, level) => {
    const { path, children, title, order, icon } = node
    const route: RouteRecordRaw = node as unknown as RouteRecordRaw
    route.meta = { title, order, icon }
    // 只要有children，那么当前路由就需要重定向到他的第一个子路由
    if (children && children.length) {
      route.redirect = children[0].path
    }
    if (level === 0) {
      route.component = Layouts
    } else {
      route.component = pageMap[path]
    }
    return route
  })
}

function normalizeViewPath (path: string): string {
  // 去除相对路径前缀
  const normalizedPath = path.replace(/^(\.\/|\.\.\/)+/, '')

  // 确保路径以 '/' 开头
  const viewPath = normalizedPath.startsWith('/')
    ? normalizedPath
    : `/${normalizedPath}`

  // 这里耦合了vben-admin的目录结构
  return viewPath.replace(/^\/views/, '').replace(/\/index\.vue$/, '')
}

/**
 * 动态生成路由 - 前端方式
 */
async function generateRoutesByFrontend (routes: RouteRecordRaw[]): Promise<RouteRecordRaw[]> {
  // @todo，可根据routes和传入配置去做一下filter或者修改的处理
  return routes
}

export { generateAccess }
