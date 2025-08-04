// 当前组件的父组件实例
import { computed, getCurrentInstance } from 'vue'
import type { SubMenuProvider } from '../type'
import { findComponentUpward } from '../utils'

export function useMenu () {
  const instance = getCurrentInstance()
  if (!instance) {
    throw new Error('instance is required')
  }
  /**
     * 获取当前组件以及父级菜单链路
     * */
  const parentPaths = computed(() => {
    let parent = instance.parent
    const paths: string[] = [instance.props.path as string]
    while (parent?.type.name !== 'MenuShow') {
      if (parent?.props.path) {
        paths.unshift(parent.props.path as string)
      }
      // 当找到Menu.vue组件，name为MenuShow，这个循环就走不进来了
      parent = parent?.parent ?? null
    }
    return paths // 如['/parentPath', '/path']
  })

  // 找到当前实例的父级，前提是name为['Menu', 'SubMenu']
  const parentMenu = computed(() => {
    return findComponentUpward(instance, ['MenuShow', 'SubMenu'])
  })
  return {
    parentPaths,
    parentMenu
  }
}

export function useMenuStyle (menu?: SubMenuProvider) {
  return computed(() => {
    return {
      '--menu-level': menu ? (menu?.level ?? 1) : 0
    }
  })
}