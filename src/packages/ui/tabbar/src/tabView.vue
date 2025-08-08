<template>
  <div class="tab-view flex h-full flex-1 overflow-hidden">
    <!-- 左侧切换 -->
    <span v-show="showScrollButton"
          class="tab-direction tab-direction-left pointer"
          :class="{
            'scrollIsAtLeft': scrollIsAtLeft,
          }"
          @click="scrollDirection('left')">
      <ChevronLeft class="icon h-full" />
    </span>
    <div class="tab-content w-full h-full flex-1 overflow-hidden">
      <Scrollbar ref="scrollbarRef" class="h-full" @wheel="onWheel" @scrollAt="handleScrollAt">
        <Tabs v-bind="{ ...$attrs,...$props }"/>
      </Scrollbar>
    </div>
    <!-- 右侧切换 -->
    <span v-show="showScrollButton"
          class="tab-direction tab-direction-right pointer"
          :class="{
            'scrollIsAtRight': scrollIsAtRight,
          }"
          @click="scrollDirection('right')">
      <ChevronRight class="icon h-full" />
    </span>
  </div>
</template>
<script setup lang="ts">
import { ChevronLeft, ChevronRight } from '@/packages/Icons'
import { Scrollbar } from '@/packages/ui/scrollbar'
import Tabs from './components/Tabs.vue'
import { useTabView } from './hooks/useTabView.ts'
import type { TabsProps } from './type.ts'

const props = withDefaults(defineProps<TabsProps>(), {
  wheelable: true
})
const {
  scrollbarRef,
  handleWheel,
  showScrollButton,
  handleScrollAt,
  scrollIsAtLeft,
  scrollIsAtRight,
  scrollDirection
} = useTabView(props)

function onWheel (e: WheelEvent){
  if (props.wheelable) {
    handleWheel(e)
    e.stopPropagation()
    e.preventDefault()
  }
}
</script>

<style lang="scss" scoped>
.tab-view {
  .tab-content {
    padding-top: 3px;
  }
  .tab-direction {
    padding: 0 8px;
    .icon {
      width: 16px;
    }
    &:hover {
      background: rgb(244,244,245);
    }
    &.tab-direction-left {
      border-right-width: 1px;
      &.scrollIsAtLeft {
        opacity: 0.3;
        pointer-events: none
      }
    }
    &.tab-direction-right {
      border-left-width: 1px;
      &.scrollIsAtRight {
        opacity: 0.3;
        pointer-events: none
      }
    }
  }
}
</style>