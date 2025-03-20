import { cloneDeep as lodashCloneDeep, mergeWith, unionWith, isEqual, intersectionWith } from 'lodash-es'
import { isArray, isObj, isFunc, isBoolean } from '@/utils/is'
/**
 * 深拷贝
 * */
export function cloneDeep<T> (obj: T) {
  return lodashCloneDeep(obj)
}

/**
 * @desc：递归合并两个对象。
 * @param source The source object to merge from. 要合并的源对象。
 * @param target The target object to merge into. 目标对象，合并后结果存放于此。相同的属性以target中的值为准
 * @param mergeArrays How to merge arrays. Default is "replace".
 *        如何合并数组。默认为replace。
 *        - "union": Union the arrays. 对数组执行并集操作。[1,2] [1,2,3] => [1,2,3]
 *        - "intersection": Intersect the arrays. 对数组执行交集操d作。[1] [2] => []   [1,2] [1] => [1]
 *        - "concat": Concatenate the arrays. 连接数组。[1] [1,2,3] => [1,1,2,3]
 *        - "replace": Replace the source array with the target array. 用目标数组替换源数组。[1] [2] => [2]
 * @returns The merged object. 合并后的对象。
 */
export function deepMerge<T extends any> (
  source: any = {},
  target: any = {},
  mergeArrays: 'union' | 'intersection' | 'concat' | 'replace' = 'replace'
): T {
  if (!target) {
    return source as T
  }
  if (!source) {
    return target as T
  }
  return mergeWith({}, source, target, (sourceValue, targetValue) => {
    if (isArray(targetValue) && isArray(sourceValue)) {
      switch (mergeArrays) {
        case 'union':
          return unionWith(sourceValue, targetValue, isEqual)
        case 'intersection':
          return intersectionWith(sourceValue, targetValue, isEqual)
        case 'concat':
          return sourceValue.concat(targetValue)
        case 'replace':
          return targetValue
        default:
          throw new Error(`Unknown merge array strategy: ${mergeArrays as string}`)
      }
    }
    if (isObj(targetValue) && isObj(sourceValue)) {
      return deepMerge(sourceValue, targetValue, mergeArrays)
    }
    return undefined
  })
}

/**
 * 通用递归
 * */
export const recursion = (list: Record<string, any>[], fn: Fn, children = 'children') => {
  const recursionFn = (arr: Record<string, any>[], parent?: Record<string, any>) => {
    let interruptFlag = false // 中断递归标志
    for (const item of arr) {
      interruptFlag = isFunc(fn) ? fn(item, parent) : false
      if (isBoolean(interruptFlag) && interruptFlag) { // 当函数返回布尔值且为true时,中断递归
        return true
      } else {
        interruptFlag = recursionFn(item[children] || [], item) || false
        if (isBoolean(interruptFlag) && interruptFlag) { // 当函数返回布尔值且为true时,中断递归
          return true
        }
      }
    }
  }
  recursionFn(list)
}
/**
 * 在多个值中，第一个值不为null或undefined，就返回这个值
 * @example
 * getFirstNonNullOrUndefined(undefined, null, 42, 'hello'); // 42
 * @example
 * getFirstNonNullOrUndefined(null, undefined, 'hello', 123); // 'hello'
 * @example
 * getFirstNonNullOrUndefined(undefined, null); // undefined
 */
export function getFirstNonNullOrUndefined<T> (
  ...values: (null | T | undefined)[]
): T | undefined {
  for (const value of values) {
    if (value !== undefined && value !== null) {
      return value
    }
  }
  return undefined
}
