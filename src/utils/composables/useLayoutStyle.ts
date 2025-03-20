import { ref, onMounted, onUnmounted } from 'vue'
import { useCssVar, useDebounceFn } from '@vueuse/core'
import { getElementVisibleRect, type VisibleDomRect } from '@/utils/dom'
/**
 * 获取内容区域高度和宽度
 * */
export function useLayoutContentStyle () {

  let resizeObserver: null | ResizeObserver = null
  // main标签容器绑定的ref
  const contentElement = ref<HTMLDivElement | null>(null)
  const visibleDomRect = ref<null | VisibleDomRect>(null)
  // 修改css中的变量
  const contentHeight = useCssVar('--zs-content-height')
  const contentWidth = useCssVar('--zs-content-width')

  // 回调函数加了防抖，防止频繁触发
  const debouncedCalcHeight = useDebounceFn(
    (_entries: ResizeObserverEntry[]) => {
      visibleDomRect.value = getElementVisibleRect(contentElement.value)
      contentHeight.value = `${visibleDomRect.value.height}px`
      contentWidth.value = `${visibleDomRect.value.width}px`
    },
    16
  )

  onMounted(() => {
    if (contentElement.value && !resizeObserver) {
      // 目标元素的大小发生变化时，回调函数debouncedCalcHeight会被触发
      // ResizeObserver 只能监测元素的内容区域或边框盒区域的大小变化，不能监测元素的位置变化
      resizeObserver = new ResizeObserver(debouncedCalcHeight)
      // 开始观察目标元素
      resizeObserver.observe(contentElement.value)
    }
  })

  onUnmounted(() => {
    resizeObserver?.disconnect()
    resizeObserver = null
  })

  return { contentElement, visibleDomRect }
}