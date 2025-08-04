<template>
  <div :class="[
    b(),
  ]">
    <Icons :icon="icon" :class="nsMenu.e('icon')"/>
    <span v-if="!hiddenTitle">
      <slot name="title" />
    </span>
    <!-- 用的是tailwindcss，size-4 -->
    <component v-show="showArrowIcon" :is="iconComp" :class="[e('icon-arrow')]" :style="iconArrowStyle" class="size-4"/>
  </div>
</template>
<script setup lang="ts">
import { ChevronDown, ChevronRight } from '@/packages/Icons'
import { Icons } from '@/packages/Icons'
import { useNamespace } from '@/packages/utils/composables/useNameSpace'
import type { MenuItemProps } from '../type'
import { computed } from 'vue'
import { useMenuContext } from '../hooks/useMenuContext'

interface Props extends MenuItemProps {
  level?: number;
}
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