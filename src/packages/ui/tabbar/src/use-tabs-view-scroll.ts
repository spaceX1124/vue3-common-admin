import type { TabsProps } from './type'

import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

import { debounce } from 'lodash-es'

type DomElement = Element | null | undefined;

export function useTabsViewScroll (props: TabsProps) {
  let resizeObserver: null | ResizeObserver = null
  let mutationObserver: MutationObserver | null = null
  let tabItemCount = 0
  const scrollbarRef = ref<any>(null)
  const scrollViewportEl = ref<DomElement>(null)
  const showScrollButton = ref(false)
  const scrollIsAtLeft = ref(true)
  const scrollIsAtRight = ref(false)

  function getScrollClientWidth () {
    const scrollbarEl = scrollbarRef.value?.$el
    if (!scrollbarEl || !scrollViewportEl.value) return {}

    const scrollbarWidth = scrollbarEl.clientWidth
    const scrollViewWidth = scrollViewportEl.value.clientWidth

    return {
      scrollbarWidth,
      scrollViewWidth
    }
  }

  function scrollDirection (
    direction: 'left' | 'right',
    distance: number = 150
  ) {
    const { scrollbarWidth, scrollViewWidth } = getScrollClientWidth()

    if (!scrollbarWidth || !scrollViewWidth) return

    if (scrollbarWidth > scrollViewWidth) return

    scrollViewportEl.value?.scrollBy({
      behavior: 'smooth',
      left:
        direction === 'left'
          ? -(scrollbarWidth - distance)
          : +(scrollbarWidth - distance)
    })
  }

  async function initScrollbar () {
    await nextTick()

    const scrollbarEl = scrollbarRef.value?.$el
    if (!scrollbarEl) {
      return
    }

    const viewportEl = scrollbarEl?.querySelector(
      'div[data-radix-scroll-area-viewport]'
    )

    scrollViewportEl.value = viewportEl
    calcShowScrollbarButton()

    await nextTick()
    scrollToActiveIntoView()

    // 监听大小变化
    resizeObserver?.disconnect()
    resizeObserver = new ResizeObserver(
      debounce((_entries: ResizeObserverEntry[]) => {
        calcShowScrollbarButton()
        scrollToActiveIntoView()
      }, 100)
    )
    resizeObserver.observe(viewportEl)

    tabItemCount = props.tabs?.length || 0
    mutationObserver?.disconnect()
    // 使用 MutationObserver 仅监听子节点数量变化
    mutationObserver = new MutationObserver(() => {
      const count = viewportEl.querySelectorAll(
        'div[data-tab-item="true"]'
      ).length

      if (count > tabItemCount) {
        scrollToActiveIntoView()
      }

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
      activeItem?.scrollIntoView({ behavior: 'smooth', inline: 'start' })
    })
  }

  /**
   * 计算tabs 宽度，用于判断是否显示左右滚动按钮
   */
  async function calcShowScrollbarButton () {
    if (!scrollViewportEl.value) {
      return
    }

    const { scrollbarWidth } = getScrollClientWidth()

    showScrollButton.value =
      scrollViewportEl.value.scrollWidth > scrollbarWidth
  }

  const handleScrollAt = debounce(({ left, right }) => {
    scrollIsAtLeft.value = left
    scrollIsAtRight.value = right
  }, 100)

  watch(
    () => props.active,
    async () => {
      // 200为了等待 tab 切换动画完成
      // setTimeout(() => {
      scrollToActiveIntoView()
      // }, 300);
    },
    {
      flush: 'post'
    }
  )
  onMounted(initScrollbar)

  onUnmounted(() => {
    resizeObserver?.disconnect()
    mutationObserver?.disconnect()
    resizeObserver = null
    mutationObserver = null
  })

  return {
    handleScrollAt,
    initScrollbar,
    scrollbarRef,
    scrollDirection,
    scrollIsAtLeft,
    scrollIsAtRight,
    showScrollButton
  }
}
