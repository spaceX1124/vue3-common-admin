import { cloneDeep as lodashCloneDeep, mergeWith, unionWith, isEqual, intersectionWith } from 'lodash-es'
import { isArray, isObj, isFunc, isBoolean, isString } from '@/packages/utils/is'
import useClipboard from 'vue-clipboard3'
import { ElMessage } from 'element-plus'

/**
 * 复制内容
 * */
export async function copy (msg: string){
  const { toClipboard } = useClipboard()
  try {
    await toClipboard(msg)
    ElMessage.success('复制成功！')
  } catch (e) {
    ElMessage.error('复制失败，请稍后重试')
  }
}

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

export const setFormData = (target: Record<string, any>, path: string, value: any) => {
  console.log(target, path, value, 'setFormData')
  const keyPath = path.split('.')

  let current = target
  for (let i = 0; i < keyPath.length - 1; i++) {
    const key = keyPath[i]
    if (!current[key]) {
      current[key] = {}
    }
    current = current[key]
  }
  const lastKey = keyPath[keyPath.length - 1]
  current[lastKey] = value
}

/**
 * 过滤没值的元素
 * */
export function removeEmptyProperties<T extends object> (obj: T): T {
  // 处理非对象类型（直接返回原始值）
  if (!isObj(obj)) {
    return obj
  }
  // 处理数组（递归过滤每个元素）
  if (isArray(obj)) {
    return obj
    .filter(item => item !== null && item !== undefined)
    .map(item => removeEmptyProperties(item)) as unknown as T
  }
  // 处理普通对象（过滤无效属性并递归处理值）
  return Object.fromEntries(
    Object.entries(obj)
    .filter(([_, value]) => {
      // 过滤掉 null 和 undefined
      if (value === null || value === undefined) return false
      // 过滤掉空字符串
      if (isString(value) && value.trim() === '') return false
      // 过滤掉空数组（递归检查数组元素是否都为空）
      if (Array.isArray(value) && value.length === 0) return false
      // 过滤掉空对象（递归检查对象所有属性是否都为空）
      return !(typeof value === 'object' && Object.keys(value).length === 0)
    })
    .map(([key, value]) => [key, removeEmptyProperties(value)])
  ) as T
}