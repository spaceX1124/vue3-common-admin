import type { Preferences } from '@/types/preferences'
/**
 * 更新主题的 CSS 变量以及其他 CSS 变量
 * @param preferences - 当前偏好设置对象，它的主题值将被用来设置文档的主题。
 */
export function updateCSSVariables (preferences: Preferences) {
  // 拿到html整个文档
  const root = document.documentElement
  if (!root) {
    return
  }
}
