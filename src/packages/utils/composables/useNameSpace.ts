/**
 * 处理class命名规范-BEM
 * */
import { DEFAULT_NAMESPACE } from '@/libs/constants'

const statePrefix = 'is-'
const _bem = (
  namespace: string,
  block: string,
  blockSuffix: string,
  element: string,
  modifier: string
) => {
  let cls = `${namespace}-${block}`
  if (blockSuffix) { // 块
    cls += `-${blockSuffix}`
  }
  if (element) { // 元素
    cls += `__${element}`
  }
  if (modifier) { // 修饰符
    cls += `--${modifier}`
  }
  return cls
}
/**
 * is('active') => 'is-active'
 * is('active', true) => 'is-active'
 * is('active', false) => ''
 * is('active', undefined) => ''
 * */
const is: {
    (name: string): string;
    (name: string, state: boolean | undefined): string;
} = (name: string, ...args: [] | [boolean | undefined]) => {
  const state = args.length > 0 ? args[0] : true
  return name && state ? `${statePrefix}${name}` : ''
}

/**
 * 使用BEM规范，看以下示例就很清楚什么是BEM了
 * block（块）：可以独立使用的 HTML 元素（比如：<nav>），可以不包含 element。
 * element（元素）：依附于 block 的 HTML 元素，无法独立存在（比如：<li>），前面要加上双下划线 __。
 * modifier（修饰符）：表示 block 或者 element 的状态和外观，前面要加上双连字符 --。
 * <nav class="menu-nav">
 *   <ul class="menu__list">
 *     <li class="menu__item">
 *       <a class="menu__link menu__link--active" href="/zh-cn/">主页</a>
 *     </li>
 *     <li class="menu__item">
 *       <a class="menu__link" href="/zh-cn/posts/">文章</a>
 *     </li>
 *     <li class="menu__item">
 *       <a class="menu__link" href="/zh-cn/about/">关于</a>
 *     </li>
 *   </ul>
 * </nav>
 * */
export function useNamespace (block: string) {
  const namespace = DEFAULT_NAMESPACE
  // 如zs-menu-
  const b = (blockSuffix = '') => _bem(namespace, block, blockSuffix, '', '')
  const e = (element?: string) =>
    element ? _bem(namespace, block, '', element, '') : ''
  const m = (modifier?: string) =>
    modifier ? _bem(namespace, block, '', '', modifier) : ''
  return {
    is,
    b,
    e,
    m
  }
}
