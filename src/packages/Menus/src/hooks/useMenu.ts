// 当前组件的父组件实例
import { computed, getCurrentInstance } from 'vue'
import type { SubMenuProvider } from '@/types/menu'

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
  return {
    parentPaths
  }
}

export function useMenuStyle (menu?: SubMenuProvider) {
  return computed(() => {
    return {
      '--menu-level': menu ? (menu?.level ?? 1) : 0
    }
  })
}