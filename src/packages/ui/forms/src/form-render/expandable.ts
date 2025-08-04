import { computed, nextTick, onMounted, ref, useTemplateRef, watch, onUnmounted } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import type { FormMethods } from '../formMethods'

/**
 * 动态计算行数
 */
export function useExpandable (formMethods: FormMethods) {
  // 拿到包含表单项的容器div
  const wrapperRef = useTemplateRef<HTMLElement>('wrapperRef')
  const rowMapping = ref<Record<number, number>>({})
  // 是否已经计算过一次
  const isCalculated = ref(false)

  const keepFormItemIndex = computed(() => {
    // 从第几行开始折叠
    const rows = formMethods.collapsedRows ?? 1
    const mapping = rowMapping.value
    let maxItem = 0
    for (let index = 1; index <= rows; index++) {
      maxItem += mapping?.[index] ?? 0
    }
    // 保持一行
    return maxItem - 1 || 1
  })

  // 当表单项数组发生变化时，重新计算行数
  watch(() => formMethods.schema.value?.length,
    async (val) => {
      if (val) {
        await nextTick()
        rowMapping.value = {}
        isCalculated.value = false
        await calculateRowMapping()
      }
    }
  )

  async function calculateRowMapping () {
    // 未开启要要折叠功能
    if (!formMethods.showCollapseButton) {
      return
    }

    await nextTick()
    if (!wrapperRef.value) {
      return
    }

    const formItems = [...wrapperRef.value.children]

    const container = wrapperRef.value
    const containerStyles = window.getComputedStyle(container)
    const rowHeights = containerStyles
    .getPropertyValue('grid-template-rows')
    .split(' ')
    const containerRect = container?.getBoundingClientRect()
    formItems.forEach((el) => {
      const itemRect = el.getBoundingClientRect()
      // 计算元素在第几行
      const itemTop = itemRect.top - containerRect.top
      let rowStart = 0
      let cumulativeHeight = 0

      for (const [i, rowHeight] of rowHeights.entries()) {
        cumulativeHeight += Number.parseFloat(rowHeight)
        if (itemTop < cumulativeHeight) {
          rowStart = i + 1
          break
        }
      }
      if (rowStart > (formMethods?.collapsedRows ?? 1)) {
        return
      }
      rowMapping.value[rowStart] = (rowMapping.value[rowStart] ?? 0) + 1
      isCalculated.value = true
    })
  }

  // 创建防抖版本
  // const debouncedUpdate = useDebounceFn(async () => {
  //   rowMapping.value = {}
  //   isCalculated.value = false
  //   await calculateRowMapping()
  // }, 10)

  // 如果加了防抖，快速改变屏幕宽度，会闪烁，数据不动就不加防抖了
  async function debouncedUpdate () {
    rowMapping.value = {}
    isCalculated.value = false
    await calculateRowMapping()
  }
  onMounted( async () => {
    window.addEventListener('resize', debouncedUpdate)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', debouncedUpdate)
  })

  return { isCalculated, keepFormItemIndex, wrapperRef }
}
