import { getCurrentInstance, inject, provide } from 'vue'
import type { MenuProvider, SubMenuProvider } from '@/types/menu'
import { findComponentUpward } from '../utils'

const menuContextKey = Symbol('menuContext')
/**
 * Provide Menu context，为组件后代提供数据，
 * */
export function createMenuContext (injectMenuData: MenuProvider) {
  provide(menuContextKey, injectMenuData)
}

/**
 * Inject Menu context，注入上层组件提供的数据
 */
export function useMenuContext () {
  // 获取组件实例
  const instance = getCurrentInstance()
  if (!instance) {
    throw new Error('instance is required')
  }
  // 有组件实例才去获取数据
  return inject(menuContextKey) as MenuProvider
}

/**
 * @zh_CN Provide SubMenu context
 */
export function createSubMenuContext (injectSubMenuData: SubMenuProvider) {
  const instance = getCurrentInstance()
  provide(`subMenu:${instance?.uid}`, injectSubMenuData)
}
/**
 * @zh_CN Inject SubMenu context
 */
export function useSubMenuContext () {
  const instance = getCurrentInstance()
  if (!instance) {
    throw new Error('instance is required')
  }
  const parentMenu = findComponentUpward(instance, ['MenuShow', 'SubMenu'])
  return inject(`subMenu:${parentMenu?.uid}`) as SubMenuProvider
}
