import { nextTick, onMounted, ref, watch } from 'vue'
import { Scrollbar } from '@/packages/ui/scrollbar'
import { useDebounceFn } from '@vueuse/core'
import type { TabsProps } from '../type.ts'

export function useTabView (props: TabsProps) {
  // 监听视口元素-ScrollAreaViewport,尺寸变化的实例
  let resizeObserver: null | ResizeObserver = null
  // 滚动组件
  const scrollbarRef = ref<InstanceType<typeof Scrollbar> | null>(null)
  // 视口元素-ScrollAreaViewport
  const scrollViewportEl = ref<Element | null>(null)
  // 是否显示左右滚动按钮
  const showScrollButton = ref(false)

  // 当前有多少个选项卡
  let tabItemCount = 0
  // 监听视口元素-ScrollAreaViewport,子节点数量变化的实例
  let mutationObserver: MutationObserver | null = null

  // 滚动条是否在最左边
  const scrollIsAtLeft = ref(true)
  // 滚动条是否在最右边
  const scrollIsAtRight = ref(false)

  /**
   * tabView组件初始化
   * */
  async function initScrollbar () {
    await nextTick()
    // 获取滚动组件的标签元素
    const scrollbarEl = scrollbarRef.value?.$el
    if (!scrollbarEl) {
      return
    }
    // 获取滚动组件中的的视口标签元素
    const viewportEl = scrollbarEl?.querySelector(
      'div[data-radix-scroll-area-viewport]'
    )
    scrollViewportEl.value = viewportEl
    // 计算是否显示左右滚动按钮
    calcShowScrollbarButton()
    await nextTick()
    await scrollToActiveIntoView()

    resizeObserver?.disconnect()
    // 监控元素的内容框/边框/设备像素框尺寸变化
    resizeObserver = new ResizeObserver(
      useDebounceFn((_entries: ResizeObserverEntry[]) => {
        // 重新计算是否显示左右滚动按钮
        calcShowScrollbarButton()
        // 重新计算滚动组件中选中的标签元素滚动到视口内
        scrollToActiveIntoView()
      }, 100)
    )
    // 监听滚动组件中的视口元素宽度变化
    resizeObserver.observe(viewportEl)

    // 当前有多少个标签元素
    tabItemCount = props.tabs?.length || 0
    mutationObserver?.disconnect()
    // 使用 MutationObserver 仅监听子节点数量变化
    // 异步监控 DOM 树的结构变化（节点增删/属性修改/文本内容变更）
    mutationObserver = new MutationObserver(() => {
      const count = viewportEl.querySelectorAll(
        'div[data-tab-item="true"]'
      ).length

      // 当新增了节点，重新计算滚动组件中选中的标签元素滚动到视口内
      if (count > tabItemCount) {
        scrollToActiveIntoView()
      }
      // 当节点发生了变化，重新计算是否显示左右滚动按钮
      if (count !== tabItemCount) {
        calcShowScrollbarButton()
        tabItemCount = count
      }
    })
    // 配置为仅监听子节点的添加和移除
    mutationObserver.observe(viewportEl, {
      attributes: false,
      childList: true,
      subtree: true
    })
  }
  /**
   * 计算tabs 宽度，用于判断是否显示左右滚动按钮
   * */
  function calcShowScrollbarButton () {
    if (!scrollViewportEl.value) {
      return
    }
    const { scrollbarWidth } = getScrollClientWidth()
    // 视口元素的滚动条宽度就是视口元素中内容的宽度，当超过滚动组件的宽度说明出现滚动条了
    showScrollButton.value = scrollViewportEl.value.scrollWidth > scrollbarWidth
  }
  /**
   * 选中的标签元素滚动到视口内
   * */
  async function scrollToActiveIntoView () {
    if (!scrollViewportEl.value) {
      return
    }
    await nextTick()
    const viewportEl = scrollViewportEl.value
    const { scrollbarWidth } = getScrollClientWidth()
    const { scrollWidth } = viewportEl

    if (scrollbarWidth >= scrollWidth) {
      return
    }
    requestAnimationFrame(() => {
      const activeItem = viewportEl?.querySelector('.is-active')
      // 滚动执行阶段,smooth:平滑滚动，block: 'start' 垂直方向顶部对齐
      activeItem?.scrollIntoView({ behavior: 'smooth', inline: 'start' })
    })
  }

  /**
   * 获取滚动组件的宽度
   * 获取滚动组件中视口的宽度
   * */
  function getScrollClientWidth () {
    const scrollbarEl = scrollbarRef.value?.$el
    if (!scrollbarEl || !scrollViewportEl.value) return {}
    const scrollbarWidth = scrollbarEl.clientWidth
    const scrollViewWidth = scrollViewportEl.value.clientWidth
    // 这两实际上是一样的值
    return {
      scrollbarWidth, // 滚动组件scrollbar的宽度
      scrollViewWidth // 滚动组件中视口的宽度
    }
  }

  /**
   * 鼠标滚轮滚动，选项卡滚动
   * */
  function handleWheel ({ deltaY }: WheelEvent) {
    scrollViewportEl.value?.scrollBy({
      // behavior: 'smooth',
      left: deltaY * 3
    })
  }

  const handleScrollAt = useDebounceFn(({ left, right }) => {
    scrollIsAtLeft.value = left
    scrollIsAtRight.value = right
  }, 100)

  /**
   * 点击左、右按钮，选项卡滚动
   * */
  function scrollDirection (
    direction: 'left' | 'right',
    distance: number = 150
  ) {
    const { scrollbarWidth, scrollViewWidth } = getScrollClientWidth()
    if (!scrollbarWidth || !scrollViewWidth) return
    if (scrollbarWidth > scrollViewWidth) return
    // 滚动组件中的视口元素平滑滚动
    scrollViewportEl.value?.scrollBy({
      behavior: 'smooth',
      left:
          direction === 'left'
            ? -(scrollbarWidth - distance)
            : +(scrollbarWidth - distance)
    })
  }

  onMounted(initScrollbar)

  // 监听选项卡切换
  watch(
    () => props.active,
    async () => {
      // 重新计算滚动组件中选中的标签元素滚动到视口内
      await scrollToActiveIntoView()
    },
    {
      flush: 'post'
    }
  )
  return {
    scrollbarRef,
    handleWheel,
    showScrollButton,
    handleScrollAt,
    scrollIsAtLeft,
    scrollIsAtRight,
    scrollDirection
  }
}