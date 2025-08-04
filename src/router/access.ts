import type { Component } from 'vue'
const Layouts = () => import('@/components/layouts/Layouts.vue')
import { forInTree, mapTree } from '@/utils/tree'
import type { IApiMenu, IApiMenuExtend, IRoute } from '@/packages/Menus'
import { http } from '@/utils/http'
import { sys } from '@/libs/requestAddress.ts'
import router from './index'

type ComponentRecordType = Record<string, () => Promise<Component>>;

/**
 * 处理可访问的路由
 * */
async function generateAccess () {
  // 获取API权限范围内数据
  const menuRoutes: IApiMenu[] = await http.get(sys.selectUserMenus)
  // 生成路由
  const accessibleRoutes = generateRoutes(menuRoutes)
  // 动态添加到router实例内
  accessibleRoutes.forEach((route) => {
    router.addRoute(route)
  })
  // 生成菜单
  const accessibleMenus = generateMenus(menuRoutes)
  return { accessibleRoutes, accessibleMenus }
}

/**
 * 根据接口数据生成路由对象数据
 * */
function generateRoutes (menuRoutes: IApiMenu[]): IRoute[] {
  try {
    // 加载所有的.vue组件
    const pageMap: ComponentRecordType = import.meta.glob('../views/**/*.vue')
    if (!menuRoutes) {
      return []
    }
    const normalizePageMap: ComponentRecordType = {}
    // 把相对路径key转成绝对路径key，并去除views，如../views/examples/form/basic/AddForm.vue =》 /examples/form/basic/AddForm.vue
    for (const [key, value] of Object.entries(pageMap)) {
      normalizePageMap[normalizeViewPath(key)] = value
    }
    const arr = mapTree<IApiMenuExtend, IRoute>(menuRoutes, (node, parent, level) => {
      const {
        path,
        children,
        title,
        order,
        icon,
        parentId,
        id
      } = node
      node.fullPath = parentId && parent ? parent.fullPath + '/' + path : path
      const route:IRoute = {
        path: '',
        component: undefined,
        meta: { title, order, icon },
        children: children || [],
        id
      }
      if(!parentId) {
        route.component = Layouts
      }
      route.path = `/${path}`
      if (children && children.length) {
        route.redirect = `/${children[0].path}`
      } else if (parentId) {
        route.component = normalizePageMap[node.fullPath]
        // name是不能重复的
        route.name = `${path}`
      }
      return route
    })
    arr.forEach((route) => {
      if (!route.children || !route.children.length) {
        const path = route.path.replace(/^\//, '')
        route.path = `/${path}${route.id}`
        if (route.meta) {
          route.meta.hideInBreadcrumb = true
        }
        route.redirect = `/${path}`
        route.children = [
          {
            component: normalizePageMap[path],
            path: `/${path}`,
            name: path,
            meta: { ...route.meta, hideInBreadcrumb: false },
            children: []
          }
        ]
      }
    })
    return arr
  } catch (error) {
    console.error(error)
    return []
  }
}

/**
 * 菜单排序
 */
function generateMenus (menuRoutes: IApiMenu[]): IApiMenu[] {
  // 生成菜单原始数据
  let menus = menuRoutes
  forInTree<IApiMenu>(menus, (node) => {
    node.path = `/${node.path}`
    if (node.children && node.children.length) {
      node.children = node.children.sort((a:IApiMenu, b: IApiMenu) => (a.order || 999) - (b.order || 999))
    }
  })
  // 对菜单进行排序
  menus = menus.sort((a, b) => (a.order || 999) - (b.order || 999))
  return menus
}

function normalizeViewPath (path: string): string {
  // 去除相对路径前缀
  const normalizedPath = path.replace(/^(\.\/|\.\.\/)+/, '')

  // 确保路径以 '/' 开头
  const viewPath = normalizedPath.startsWith('/')
    ? normalizedPath
    : `/${normalizedPath}`

  // 这里耦合了views的目录结构
  return viewPath.replace(/^\/views\//, '').replace(/\/index\.vue$/, '')
}

export { generateAccess }
