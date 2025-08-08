<template>
  <ScrollAreaRoot v-bind="delegatedProps" class="relative overflow-hidden">
    <ScrollAreaViewport class="h-full w-full" as-child @scroll="handleScroll">
      <div v-if="showShadowTop"
           class="scrollbar-top-shadow w-full opacity-0"
           :class="{
             'opacity-100': !isAtTop,
             'border-t': shadowBorder && !isAtTop,
           }"/>
      <slot/>
      <div v-if="showShadowBottom"
           class="scrollbar-bottom-shadow w-full opacity-0"
           :class="{
             'opacity-100': !isAtBottom,
             'border-b': shadowBorder && !isAtBottom,
           }"/>
    </ScrollAreaViewport>
    <!-- 横向滚动条 -->
    <ScrollAreaScrollbar :asChild="false" :force-mount="false" class="horizontal-scrollbar flex" orientation="horizontal">
      <ScrollAreaThumb class="horizontal-thumb flex-1" />
    </ScrollAreaScrollbar>
    <!-- 纵向滚动条 -->
    <ScrollAreaScrollbar :asChild="false" :force-mount="false" class="vertical-scrollbar flex h-full" orientation="vertical">
      <ScrollAreaThumb class="vertical-thumb flex-1" />
    </ScrollAreaScrollbar>
    <ScrollAreaCorner />
  </ScrollAreaRoot>
</template>
<script lang="ts" setup>
import {
  ScrollAreaCorner,
  ScrollAreaRoot,
  ScrollAreaViewport,
  ScrollAreaScrollbar,
  ScrollAreaThumb
} from 'radix-vue'
import type { ScrollAreaRootProps } from 'radix-vue'
import { computed, ref } from 'vue'
// asChild 的作用是让组件不渲染自身的默认 DOM 元素，而是直接使用其子元素作为渲染目标，同时保留组件的所有功能（如事件监听、样式注入等）。简单说：它允许你将组件的功能“附加”到现有的子元素上。

const props = withDefaults(defineProps<ScrollAreaRootProps & {
  class?: any;
  onScroll?: (event: Event) => void;
  viewportProps?: { onScroll: (event: Event) => void };
  shadow?: boolean;
  shadowBorder?: boolean;
  shadowBottom?: boolean;
  shadowLeft?: boolean;
  shadowRight?: boolean;
  shadowTop?: boolean;
}>(), {
  onScroll: () => {},
  shadow: false,
  shadowBorder: false,
  shadowBottom: true,
  shadowLeft: false,
  shadowRight: false,
  shadowTop: true
})
const emit = defineEmits(['scrollAt'])

const isAtTop = ref(true)
const isAtRight = ref(false)
const isAtBottom = ref(false)
const isAtLeft = ref(true)

const showShadowTop = computed(() => props.shadow && props.shadowTop)
const showShadowBottom = computed(() => props.shadow && props.shadowBottom)
const showShadowLeft = computed(() => props.shadow && props.shadowLeft)
const showShadowRight = computed(() => props.shadow && props.shadowRight)

function handleScroll (event: Event) {
  const target = event.target as HTMLElement
  const scrollTop = target?.scrollTop ?? 0
  const scrollLeft = target?.scrollLeft ?? 0
  const clientHeight = target?.clientHeight ?? 0
  const clientWidth = target?.clientWidth ?? 0
  const scrollHeight = target?.scrollHeight ?? 0
  const scrollWidth = target?.scrollWidth ?? 0
  isAtTop.value = scrollTop <= 0 // 滚动到顶部
  isAtLeft.value = scrollLeft <= 0 // 滚动到最左侧
  isAtBottom.value =
      Math.abs(scrollTop) + clientHeight >=
      scrollHeight - 1 // 滚动到底部
  isAtRight.value =
      Math.abs(scrollLeft) + clientWidth >=
      scrollWidth - 1 // 滚动到最右侧
  // 告诉外面，当前滚动条在什么位置
  emit('scrollAt', {
    bottom: isAtBottom.value,
    left: isAtLeft.value,
    right: isAtRight.value,
    top: isAtTop.value
  })
}

const delegatedProps = computed(() => {
  const {
    shadowBorder: shadowBorder,
    shadow: shadow,
    shadowBottom: shadowBottom,
    shadowLeft: shadowLeft,
    shadowRight: shadowRight,
    shadowTop: shadowTop,
    ...delegated
  } = props
  return delegated
})
</script>

<style lang="scss" scoped>
.horizontal-scrollbar {
  height: 10px;
  padding: 1px;
  border-top-width: 1px;
  border-top-color: transparent;
  .horizontal-thumb {
    border-radius: 9999px;
    background-color: rgb(54,54,58);
  }
}
.vertical-scrollbar {
  width: 10px;
  padding: 1px;
  border-left-width: 1px;
  border-left-color: transparent;
  .vertical-thumb {
    border-radius: 9999px;
    background-color: rgb(54,54,58);
  }
}

%scrollbar-shadow {
  height: 48px;
  position: absolute;
  z-index: 10;
  transition-property: opacity;
  transition-duration: 300ms;
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  will-change: opacity;
  background: linear-gradient(to bottom, rgb(28, 30, 35), transparent);
}
.scrollbar-top-shadow {
  @extend %scrollbar-shadow;
  top: 0;
  &.border-t {
    border-top-width: 1px;
    border-color: rgb(54,54,58);
  }
}
.scrollbar-bottom-shadow {
  @extend %scrollbar-shadow;
  bottom: 0;
  &.border-b {
    border-bottom-width: 1px;
    border-color: rgb(54,54,58);
  }
}
</style>