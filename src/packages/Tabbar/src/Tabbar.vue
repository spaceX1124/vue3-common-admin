<template>
  <div class="h-full flex flex-1 overflow-hidden">
    <!-- 左侧滚动按钮 -->
    <span class="border-r px-2 cursor-pointer" @click="navTurnLeft">
      <ChevronLeft class="size-4 h-full" />
    </span>
    <div class="pt-[3px] flex-1 size-full overflow-hidden" ref="centerRef">
      <Tabs ref="scrollRef" v-bind="{ ...$props, ...$attrs }" @onMounted="tabsMounted"/>
    </div>
    <!-- 右侧滚动按钮 -->
    <span class="hover:bg-muted text-muted-foreground cursor-pointer border-l px-2" @click="navTurnRight">
      <ChevronRight class="size-4 h-full" />
    </span>
  </div>
</template>
<script lang="ts" setup>
import Tabs from './components/Tabs.vue'
import type { TabsProps } from './type'
import { ChevronLeft, ChevronRight } from '@/packages/Icons'
import { nextTick, ref, unref, watch } from 'vue'

interface PropsType extends TabsProps {}
const props = withDefaults(defineProps<PropsType>(), {})

const centerRef = ref()
const scrollRef = ref()

const getPositionWidth = () => {
  const centerDom = unref(centerRef) as unknown as Element
  const scrollDom = unref(scrollRef.value.getTabsRef()) as unknown as Element
  const { width: centerWidth } = centerDom && getComputedStyle(centerDom)
  const { left } = scrollDom && getComputedStyle(scrollDom)
  const scrollWidth = scrollDom.scrollWidth
  return {
    centerWidth: parseInt(centerWidth),
    scrollWidth: scrollWidth,
    left: parseInt(left)
  }
}

//  确保激活项一直在可视窗内
const showActiveItem = () => {
  const { centerWidth, scrollWidth, left } = getPositionWidth()
  const scrollDom = unref(scrollRef.value.getTabsRef()) as unknown as Element
  const target = scrollDom.getElementsByClassName('active-tag')[0]
  if(!target) return
  // 当前active项右边距离父级最左侧的距离
  const targetOffset = (target as any).offsetLeft + target.clientWidth + left
  // 内部滚动项宽度大于父级才去处理自动滚动
  if (scrollWidth > centerWidth) {
    // 激活项在左边被隐藏
    if (targetOffset < target.clientWidth) {
      // 计算需要回填几个身位 默认+1确保激活项展示出来
      const num = parseInt(`${Math.abs(targetOffset) / centerWidth}`) + 1
      const result = left + num * centerWidth
      controlScroll(result)
    }
    //  激活项在右边被隐藏
    if (targetOffset > centerWidth) {
      // 获取倍数 判断需要移动几个身位
      // const num = parseInt(`${targetOffset / centerWidth}`)
      controlScroll(-(targetOffset - centerWidth + Math.abs(left)))
      // controlScroll(-(targetOffset - num * centerWidth + Math.abs(left)))
    }
  }
}

//  操控滚动条
const controlScroll = (num: number) => {
  const scrollDom = unref(scrollRef.value.getTabsRef()) as unknown as Element
  // 确保left参数必然<=0
  (scrollDom as any).style.left = `${num > 0 ? 0 : num}px`
}

const navTurnLeft = () => {
  const { centerWidth, left } = getPositionWidth()
  // 偏移没有超过父级宽度直接顺移到0
  if (left <= 0 && left >= -centerWidth) {
    controlScroll(0)
  }
  // 偏移超过了父级宽度直接移一个父级宽度身位
  if (left < -centerWidth) {
    controlScroll(left + centerWidth)
  }
}

const navTurnRight = () => {
  const { centerWidth, scrollWidth, left } = getPositionWidth()
  // dirft 表示还隐藏在右边的长度
  const drift = scrollWidth - Math.abs(left) - centerWidth
  //  隐藏长度小于父级宽度 那直接拉到最右边
  if (drift <= centerWidth) {
    controlScroll(-(Math.abs(left) + drift))
  }
  //  隐藏宽度大于父级宽度 直接左移一个父级身位
  if (drift > centerWidth) {
    controlScroll(-(Math.abs(left) + centerWidth))
  }
}

watch(() => props.active, () => {
  nextTick(() => {
    showActiveItem()
  })
})
function tabsMounted () {
  showActiveItem()
}
</script>