<template>
  <!-- 该组件根据 -->
  <Layouts
    :sidebar-width="preferences.sidebar.width"
    :sidebar-collapse="preferences.sidebar.collapsed"
    :sidebar-hidden="preferences.sidebar.hidden"
    @update:sidebar-collapse="(value: boolean) => updatePreferences({ sidebar: { collapsed: value } })"
    @toggle-sidebar="toggleSidebar"
  >
    <template #logo>
      <div class="h-full flex items-center px-3 transition-all duration-150">
        <img class="w-8" src="https://unpkg.com/@vbenjs/static-source@0.1.7/source/logo-v1.webp" alt="">
        <span v-if="!preferences.sidebar.collapsed" class="font-semibold ml-2 text-white">ZS Admin</span>
      </div>
    </template>
    <template #menu>
      <Menu
        :menus="sidebarMenus"
        :collapse="preferences.sidebar.collapsed"
        :default-active="sidebarActive"
        @select="handleMenuSelect"
      />
    </template>
    <template #header>
      <LayoutHeader/>
    </template>
    <template #tabBar>
      <TabBar/>
    </template>
    <!-- 主题内容 -->
    <template #content>
      <Content/>
    </template>
    <!-- 页面加载的动画效果 -->
    <template #content-overlay>
      <LayoutContentSpinner />
    </template>
  </Layouts>
</template>
<script lang="ts" setup>
import { Layouts } from '@/packages/Layouts'
import Content from './components/content/Content.vue'
import Menu from './components/menu/Menu.vue'
import TabBar from '@/components/layouts/components/tab-bar/TabBar.vue'
import LayoutHeader from './components/header/Header.vue'
import { useMixedMenu } from './components/menu/useMixedMenu'
import { preferences, updatePreferences } from '@/preferences'
import LayoutContentSpinner from './components/content/ContentSpinner.vue'

const {
  sidebarMenus,
  sidebarActive,
  handleMenuSelect
} = useMixedMenu()

function toggleSidebar () {
  updatePreferences({
    sidebar: {
      hidden: !preferences.sidebar.hidden
    }
  })
}
</script>