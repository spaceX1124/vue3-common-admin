<template>
  <div class="flex min-h-full w-full" style="height: 100%">
    <!-- 左侧 -->
    <LayoutSidebar
      v-model:collapse="sidebarCollapse"
      :width="getSidebarWidth"
    >
      <template #logo>
        <slot name="logo"/>
      </template>
      <slot name="menu"/>
    </LayoutSidebar>
    <!-- 右侧 -->
    <div class="flex-1 overflow-hidden">
      <div class="overflow-hidden">
        <LayoutHeader>
          <button class="ml-2 mr-1 px-1">
            <Icons :icon="Menu" class="size-4"/>
          </button>
          <slot name="header"/>
        </LayoutHeader>
        <LayoutTabBar
          :height="tabBarHeight"
        >
          <slot name="tabBar"/>
        </LayoutTabBar>
      </div>
      <LayoutContent>
        <slot name="content"/>
      </LayoutContent>
    </div>
  </div>
</template>
<script lang="ts" setup>
import LayoutSidebar from './components/layoutSidebar.vue'
import LayoutContent from './components/layoutContent.vue'
import LayoutHeader from './components/layoutHeader.vue'
import LayoutTabBar from './components/layoutTabbar.vue'
import { computed } from 'vue'
import type { LayoutProps } from '@/types/layout'
import { Icons, Menu } from '@/packages/Icons'

interface PropsType extends LayoutProps {}
const props = withDefaults(defineProps<PropsType>(), {
  sidebarWidth: 180, // 侧边栏宽度
  tabBarHeight: 38 // tabBar的高度
})
// 动态获取侧边栏的宽度
const getSidebarWidth = computed(() => {
  const { sidebarWidth } = props
  let width = 0
  width = sidebarWidth
  return width
})

const sidebarCollapse = defineModel<boolean>('sidebarCollapse')
</script>