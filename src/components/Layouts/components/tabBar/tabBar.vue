<template>
  <TabBar
    :active="currentActive"
    @update:active="handleClick"
    :tabs="currentTabs"
  />
  <div class="flex-center">
    <div
      class="flex-center hover:bg-muted hover:text-foreground text-muted-foreground border-border h-full cursor-pointer border-l px-2 text-lg font-semibold"
    >
      <ChevronDown class="size-4" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useTabBar } from './useTabBar'
import { TabBar } from '@/packages/Tabbar'
import { ChevronDown } from '@/packages/Icons'

const {
  currentTabs,
  currentActive,
  handleClick
} = useTabBar()
</script>