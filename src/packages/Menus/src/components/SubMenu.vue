<template>
  <li :class="[
    b(),
    is('active', active),
    is('opened', opened),
  ]">
    <SubMenuContent @click.stop="handleClick" :icon="icon" :path="path">
      <slot name="content"/>
      <template #title>
        <slot name="title"/>
      </template>
    </SubMenuContent>
    <CollapseTransition>
      <ul v-show="opened" :class="[nsMenu.b(), is('rounded', rounded)]" :style="subMenuStyle">
        <slot/>
      </ul>
    </CollapseTransition>
  </li>
</template>
<script setup lang="ts">
import CollapseTransition from './collapse-transition.vue'
import SubMenuContent from './SubMenuContent.vue'
import { computed, ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { useMenuContext, createSubMenuContext, useSubMenuContext } from '../hooks/useMenuContext'
import type { SubMenuProps, MenuProvider, MenuItemRegistered } from '@/types/menu'
import { useNamespace } from '@/utils/composables/useNameSpace'
import { useMenu, useMenuStyle } from '../hooks/useMenu'

interface PropsType extends SubMenuProps {}
const props = withDefaults(defineProps<PropsType>(), {})
defineOptions({ name: 'SubMenu' })

// 当前SubMenu组件保存的所有后代MenuItem数据
const subMenus = ref<MenuProvider['subMenus']>({})

const mouseInChild = ref(false)

// 遵循BEM规范
const { b, is } = useNamespace('sub-menu')
const nsMenu = useNamespace('menu')

// 获取最外层Menu组件注入的数据
const rootMenu = useMenuContext()

// 获取当前SubMenu组件的上层SubMenu组件注入的数据
const subMenu = useSubMenuContext()
// 给ul设置等级--menu-level变量
const subMenuStyle = useMenuStyle(subMenu)

// 获取当前菜单项及父级链路
const { parentPaths } = useMenu()

// 当前SubMenu的path是否在展开菜单数据openedMenus中
const opened = computed(() => {
  return rootMenu?.openedMenus.includes(props.path)
})

// 是否为圆角
const rounded = computed(() => rootMenu?.props.rounded)

// 只要当前SubMenu保存的所有后代数据subMenus中有active为true的，那么这个SubMenu就是打开的
const active = computed(() => {
  let isActive = false
  Object.values(subMenus.value).forEach((subItem) => {
    if (subItem.active) {
      isActive = true
    }
  })
  return isActive
})

// 为当前SubMenu逐渐的后代提供数据
createSubMenuContext({
  addSubMenu,
  level: (subMenu?.level ?? 0) + 1, // 前者为null或者undefined就取后者
  mouseInChild,
  removeSubMenu
})

function addSubMenu (subMenu: MenuItemRegistered) {
  subMenus.value[subMenu.path] = subMenu
}

function removeSubMenu (subMenu: MenuItemRegistered) {
  Reflect.deleteProperty(subMenus.value, subMenu.path)
}

/**
 * 点击submenu展开/关闭
 */
function handleClick () {
  rootMenu?.handleSubMenuClick({
    active: active.value,
    parentPaths: parentPaths.value,
    path: props.path
  })
}
const item = reactive({
  active,
  parentPaths,
  path: props.path
})

onMounted(() => {
  // 将重新组装的SubMenu项数据存起来
  subMenu?.addSubMenu?.(item)
  rootMenu?.addSubMenu?.(item)
})

onBeforeUnmount(() => {
  subMenu?.removeSubMenu?.(item)
  rootMenu?.removeSubMenu?.(item)
})
</script>
