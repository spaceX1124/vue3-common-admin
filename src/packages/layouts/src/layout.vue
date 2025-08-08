<template>
  <!-- 整体布局应用包，提供页面各个模块的布局位置，并提供slot -->
  <div class="flex h-full w-full">
    <!-- 左侧区域 -->
    <LayoutSidebar
      v-model:collapse="sidebarCollapse"
      :width="getSidebarWidth"
      :collapseWidth="collapseWidth"
    >
      <!-- 展示logo的位置 -->
      <template #logo>
        <slot name="logo"/>
      </template>
      <!-- 展示菜单的位置 -->
      <slot name="menu"/>
    </LayoutSidebar>
    <!-- 右侧区域 -->
    <div class="flex-1 flex flex-col overflow-hidden transition-all">
      <!-- 头部 -->
      <div class="overflow-hidden transition-all" :style="headerWrapperStyle" >
        <!-- header -->
        <LayoutHeader :height="headerHeight">
          <button class="toggle-sidebar pointer" @click="handleHeaderToggle">
            <Icons :icon="Menu" class="icon"/>
          </button>
          <slot name="header"/>
        </LayoutHeader>
        <!-- tab-bar -->
        <LayoutTabBar :height="tabBarHeight">
          <slot name="tabBar"/>
        </LayoutTabBar>
      </div>
      <!-- 主体内容 -->
      <LayoutContent :style="contentStyle">
        <!-- 要渲染主体内容的位置 -->
        <slot name="content"/>
        <!-- 遮罩层loading -->
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
  // 如果侧边栏隐藏，则返回0
  if (props.sidebarHidden) {
    return width
  }
  // 取得侧边栏的宽度
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
<style lang="scss" scoped>
.toggle-sidebar {
  margin: 0 4px 0 8px;
  padding: 0 4px 0 4px;
  .icon {
    width: 16px;
    height: 16px;
  }
}
</style>