<template>
  <MenuItem v-if="!hasChildren" :path="menu.path" :icon="menu.icon">
    <template #title>
      <span>{{ menu.title }}</span>
    </template>
  </MenuItem>
  <SubMenuComp v-else :path="menu.path" :icon="menu.icon">
    <template #title>{{ menu.title }}</template>
    <template v-for="childItem in menu.children || []" :key="childItem.path">
      <SubMenu :menu="childItem" />
    </template>
  </SubMenuComp>
</template>
<script lang="ts" setup>
import { MenuItem, SubMenu as SubMenuComp } from './components'
import SubMenu from './SubMenu.vue'
import type { MenuRecordRaw } from '@/packages/ui/menus'
import { computed } from 'vue'
interface PropsType {
  menu: MenuRecordRaw; // 当前菜单项
}
const props = withDefaults(defineProps<PropsType>(), {})
defineOptions({ name: 'SubMenuUi' })

// 判断是否有子节点，动态渲染 menu-item/sub-menu-item
const hasChildren = computed(() => {
  const { menu } = props
  return (
    Reflect.has(menu, 'children') && !!menu.children && menu.children.length > 0
  )
})
</script>
