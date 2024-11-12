<template>
  <Menu v-bind="$props">
    <template v-for="menu in menus" :key="menu.path">
      <SubMenu :menu="menu" />
    </template>
  </Menu>
</template>
<script lang="ts" setup>
import { Menu } from './components'
import SubMenu from './SubMenu.vue'
import type { MenuProps, MenuRecordRaw } from '@/types/menu'
// Menu菜单组件所接收的参数
interface PropsType extends MenuProps {
  menus: MenuRecordRaw[]; // 接收的菜单数据
}
defineOptions({ name: 'MenuUi' })
withDefaults(defineProps<PropsType>(), {
  collapse: false, // 菜单是否折叠，默认值
  mode: 'vertical', // 菜单模式，默认值
  theme: 'light', // 菜单主题，默认值
  rounded: true // 显示圆角
})
</script>
