<template>
  <div :class="[
    b(),
  ]">
    <Icons :icon="icon" :class="nsMenu.e('icon')"/>
    <slot name="title"/>
    <!-- 用的是tailwindcss，size-4 -->
    <component :is="ChevronDown" :class="[e('icon-arrow')]" :style="iconArrowStyle" class="size-4"/>
  </div>
</template>
<script setup lang="ts">
import { ChevronDown } from '@/packages/Icons'
import { Icons } from '@/packages/Icons'
import { useNamespace } from '@/utils/composables/useNameSpace'
import type { MenuItemProps } from '@/types/menu'
import { computed } from 'vue'
import { useMenuContext } from '../hooks/useMenuContext'

interface Props extends MenuItemProps {}
const props = withDefaults(defineProps<Props>(), {})

const { b, e } = useNamespace('sub-menu-content')
const nsMenu = useNamespace('menu')

const rootMenu = useMenuContext()
// 判断当前菜单是否已经在展开的 SubMenu 菜单项数据中
const opened = computed(() => {
  return rootMenu?.openedMenus.includes(props.path)
})
// 如果展开的，就旋转180度，
const iconArrowStyle = computed(() => {
  return opened.value ? { transform: 'rotate(180deg)' } : {}
})
</script>