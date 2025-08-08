<template>
  <div class="sub-menu-content">
    <Icons :icon="icon" class="menu__icon"/>
    <span v-if="!hiddenTitle">
      <slot name="title" />
    </span>
    <component v-show="showArrowIcon" :is="iconComp" class="sub-menu-content__icon-arrow" :style="iconArrowStyle"/>
  </div>
</template>
<script setup lang="ts">
import { ChevronDown, ChevronRight } from '@/packages/Icons'
import { Icons } from '@/packages/Icons'
import type { MenuItemProps } from '../type'
import { computed } from 'vue'
import { useMenuContext } from '../hooks/useMenuContext'

interface Props extends MenuItemProps {
  level?: number;
}
const props = withDefaults(defineProps<Props>(), {})

const rootMenu = useMenuContext()
// 判断当前菜单是否已经在展开的 SubMenu 菜单项数据中
const opened = computed(() => {
  return rootMenu?.openedMenus.includes(props.path)
})
// 如果展开的，就旋转180度，
const iconArrowStyle = computed(() => {
  return opened.value ? { transform: 'rotate(180deg)' } : {}
})

const collapse = computed(() => {
  return rootMenu.props.collapse
})

const isFirstLevel = computed(() => {
  return props.level === 1
})

const hiddenTitle = computed(() => {
  return (
    isFirstLevel.value &&
      collapse.value
  )
})

const showArrowIcon = computed(() => {
  return !(isFirstLevel.value && collapse.value)
})

const iconComp = computed(() => {
  return collapse.value ? ChevronRight : ChevronDown
})
</script>