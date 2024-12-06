<template>
  <Layouts
    :sidebar-width="preferences.sidebar.width"
    :sidebar-collapse="preferences.sidebar.collapsed"
    :sidebar-hidden="preferences.sidebar.hidden"
    @update:sidebar-collapse="(value: boolean) => updatePreferences({ sidebar: { collapsed: value } })"
    @toggle-sidebar="toggleSidebar"
  >
    <template #logo>
      <div class="h-full flex items-center px-3">
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
    <template #content>
      <Content/>
    </template>
  </Layouts>
</template>
<script lang="ts" setup>
import { Layouts } from '@/packages/Layouts'
import Content from './components/content/content.vue'
import Menu from './components/menu/menu.vue'
import TabBar from './components/tabBar/tabBar.vue'
import LayoutHeader from './components/header/header.vue'
import { useMixedMenu } from './components/menu/useMixedMenu'
import { preferences, updatePreferences } from '@/preferences'

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