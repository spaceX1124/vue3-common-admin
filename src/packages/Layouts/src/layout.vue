<template>
  <div class="flex min-h-full w-full">
    <!-- 左侧 -->
    <LayoutSidebar
      v-model:collapse="sidebarCollapse"
      :width="getSidebarWidth"
      :collapseWidth="collapseWidth"
    >
      <template #logo>
        <slot name="logo"/>
      </template>
      <slot name="menu"/>
    </LayoutSidebar>
    <!-- 右侧 -->
    <div class="flex-1 flex flex-col overflow-hidden transition-all duration-150">
      <div class="overflow-hidden transition-all duration-150" :style="headerWrapperStyle" >
        <!-- header -->
        <LayoutHeader :height="headerHeight">
          <button class="ml-2 mr-1 px-1" @click="handleHeaderToggle">
            <Icons :icon="Menu" class="size-4"/>
          </button>
          <slot name="header"/>
        </LayoutHeader>
        <!-- tabBar -->
        <LayoutTabBar
          :height="tabBarHeight"
        >
          <slot name="tabBar"/>
        </LayoutTabBar>
      </div>
      <!-- content -->
      <LayoutContent :style="contentStyle">
        <slot name="content"/>
        <template #overlay>
          <slot name="content-overlay"/>
        </template>
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
import type { CSSProperties } from 'vue'
interface PropsType extends LayoutProps {}
const props = withDefaults(defineProps<PropsType>(), {
  sidebarWidth: 180, // 侧边栏宽度
  collapseWidth: 60, // 侧边栏折叠宽度
  tabBarHeight: 38, // tabBar的高度
  headerHeight: 50, // header的高度
  sidebarHidden: false // 侧边栏是否隐藏
})
// 动态获取侧边栏的宽度
const getSidebarWidth = computed(() => {
  let width = 0
  if (props.sidebarHidden) {
    console.log(width, 'width132', props.sidebarHidden)
    return width
  }
  width = props.sidebarWidth
  return width
})

const sidebarCollapse = defineModel<boolean>('sidebarCollapse')

const headerWrapperStyle = computed((): CSSProperties => {
  const { sidebarCollapse, collapseWidth, sidebarWidth, sidebarHidden } = props
  let left = sidebarHidden ? 0 : sidebarCollapse ? collapseWidth : sidebarWidth
  return {
    height: `${props.headerHeight + props.tabBarHeight}px`, // 面包屑+tabBar的高度
    left: `${left}px`,
    position: 'fixed',
    top: 0,
    width: `calc(100% - ${left}px)`,
    zIndex: 200
  }
})

const contentStyle = computed((): CSSProperties => {
  return {
    marginTop: `${props.headerHeight + props.tabBarHeight}px`
  }
})
const emit = defineEmits<{ toggleSidebar: [] }>()
function handleHeaderToggle () {
  emit('toggleSidebar')
}
</script>