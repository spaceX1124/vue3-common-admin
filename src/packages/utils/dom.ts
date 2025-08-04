export interface VisibleDomRect {
    bottom: number;
    height: number;
    left: number;
    right: number;
    top: number;
    width: number;
}
/**
 * 获取元素可见信息
 * @param element
 */
export function getElementVisibleRect (
  element?: HTMLElement | null | undefined
): VisibleDomRect {
  if (!element) {
    return {
      bottom: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      width: 0
    }
  }
  /**
   * x：元素左边界相对于视口左边界的水平距离（以像素为单位）。
   * y：元素上边界相对于视口上边界的垂直距离（以像素为单位）。
   * width：元素的宽度，包含内容区、内边距和边框，但不包含外边距（以像素为单位）。
   * height：元素的高度，包含内容区、内边距和边框，但不包含外边距（以像素为单位）。
   * top：元素上边界相对于视口上边界的垂直距离（以像素为单位），等同于 y 属性。
   * right：元素右边界相对于视口左边界的水平距离（以像素为单位），其值为 x + width。
   * bottom：元素下边界相对于视口上边界的垂直距离（以像素为单位），其值为 y + height。
   * left：元素左边界相对于视口左边界的水平距离（以像素为单位），等同于 x 属性。
   * */
  // 用于获取元素在视口内位置和尺寸信息的方法
  const rect = element.getBoundingClientRect()
  const viewHeight = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight
  )
  // 返回参数中的最大那个数
  const top = Math.max(rect.top, 0)
  // 返回参数中的最小那个数
  const bottom = Math.min(rect.bottom, viewHeight)

  const viewWidth = Math.max(
    document.documentElement.clientWidth,
    window.innerWidth
  )

  const left = Math.max(rect.left, 0)
  const right = Math.min(rect.right, viewWidth)

  return {
    bottom,
    height: Math.max(0, bottom - top),
    left,
    right,
    top,
    width: Math.max(0, right - left)
  }
}