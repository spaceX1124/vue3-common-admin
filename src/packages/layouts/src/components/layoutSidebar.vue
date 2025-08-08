<template>
  <div :style="style" class="h-full transition-all"/>
  <aside 
    :style="style"
    class="aside h-full border-r transition-all"
  >
    <div :style="{height: headerHeight + 'px'}">
      <slot name="logo"/>
    </div>
    <!-- 到时候封装一个滚动的容器，重写滚动条样式 -->
    <Scrollbar :style="contentStyle" shadow shadow-border>
      <slot/>
    </Scrollbar>
    <div :style="{height: collapseHeight + 'px'}" class="collapsed-sidebar flex items-center">
      <div class="text-foreground_60">
        <ChevronsLeft @click="handleCollapsed" class="icon"/>
      </div>
    </div>
  </aside>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { ChevronsLeft } from '@/packages/Icons'
import { Scrollbar } from '@/packages/ui/scrollbar'

interface PropsType {
  width: number; // 侧边栏宽度
  collapseWidth?: number; // 折叠宽度
}
const props = withDefaults(defineProps<PropsType>(), {
  collapseWidth: 60// 折叠宽度
})

// defineModel这个宏可以用来声明一个双向绑定 prop，通过父组件的 v-model 来使用
// 在底层，这个宏声明了一个 model prop 和一个相应的值更新事件。如果第一个参数是一个字符串字面量，它将被用作 prop 名称
const collapsed = defineModel<boolean>('collapse')

// 折叠处div高度
const collapseHeight = 42
// 头部logo处div高度
const headerHeight = 50

const style = computed(() => {
  const { width, collapseWidth } = props
  let widthValue = width
  if (width !== 0 && collapsed.value) {
    widthValue = collapseWidth
  }
  return {
    width: `${widthValue}px`
  }
})
const contentStyle = computed(() => {
  return {
    height: `calc(100% - ${headerHeight + collapseHeight}px)`,
    paddingTop: '8px'
  }
})

function handleCollapsed () {
  collapsed.value = !collapsed.value
}

</script>
<style lang="scss" scoped>
.aside {
  position: fixed;
  left: 0;
  top: 0;
  border-right-width: 1px;
  flex-shrink: 0;
  background-color: rgb(var(--sidebar));
  .collapsed-sidebar {
    padding: 0 8px 0 8px;
    .text-foreground_60 {
      color: rgba(255,255,255,.6);
      background-color: rgb(46,48,51);
      padding: 4px;
      border-radius: 4px;
      .icon {
        width: 16px;
        height: 16px;
      }
    }
  }
}
</style>