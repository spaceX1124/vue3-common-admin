<template>
  <li
    :class="[
      rootMenu.theme,
      b(),
      is('active', active)
    ]"
    @click.stop="handleClick">
    <div :class="[e('content')]">
      <Icons :icon="icon" :class="nsMenu.e('icon')"/>
      <slot/>
      <slot name="title"/>
    </div>
  </li>
</template>
<script setup lang="ts">
import type { MenuItemProps, MenuItemRegistered } from '@/types/menu'
import { useMenuContext, useSubMenuContext } from '../hooks/useMenuContext'
import { useMenu } from '../hooks/useMenu'
import { useNamespace } from '@/utils/composables/useNameSpace'
import { computed, onMounted, onBeforeUnmount, reactive } from 'vue'
import { Icons } from '@/packages/Icons'

// MenuItem接收的参数
interface PropsType extends MenuItemProps {}
const props = withDefaults(defineProps<PropsType>(), {})

const emit = defineEmits<{ click: [MenuItemRegistered] }>()
// 设置组件的名称
defineOptions({ name: 'MenuItem' })

// 遵循BEM规范
const { is, b, e } = useNamespace('menu-item')
const nsMenu = useNamespace('menu')

// 获取最外层Menu组件注入的数据
const rootMenu = useMenuContext()

// 获取当前MenuItem组件的上级SubMenu组件提供的数据
const subMenu = useSubMenuContext()

// 获取当前菜单项及父级链路
const { parentPaths } = useMenu()

// 当前菜单项是否是active的, rootMenu?.activePath是当前选中的菜单的path
const active = computed(() => {
  console.log(rootMenu, 'rootMenu')
  return props.path === rootMenu?.activePath
})

/**
 * 菜单项点击事件
 */
function handleClick () {
  // 执行父级提供的点击菜单项事件
  rootMenu?.handleMenuItemClick?.({
    parentPaths: parentPaths.value,
    path: props.path
  })
  emit('click', item)
}
const item: MenuItemRegistered = reactive({
  active,
  parentPaths: parentPaths.value,
  path: props.path || ''
})

onMounted(() => {
  subMenu?.addSubMenu?.(item)
  rootMenu?.addMenuItem?.(item)
})

onBeforeUnmount(() => {
  subMenu?.removeSubMenu?.(item)
  rootMenu?.removeMenuItem?.(item)
})
</script>
