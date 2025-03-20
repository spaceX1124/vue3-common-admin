const toString = Object.prototype.toString
export function is (val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`
}

/**
 * 判断是否是一个Object
 * */
export function isObj (val: unknown): val is Record<any, any> {
  // null也是对象类型，判断对象类型的时候排除掉null
  return val !== null && is(val, 'Object')
}

/**
 * 判断是否是一个数组
 * */
export function isArray (val: any): val is any[] {
  return val && Array.isArray(val)
}
/**
 * 判断是否是空数组
 * */
export function isEmptyArray (val: any): boolean {
  return isArray(val) && val.length === 0
}

/**
 * 判断是否是一个函数
 * */
export function isFunc (val: unknown): val is Function {
  return typeof val === 'function'
}

/**
 * 判断是否是一个字符串
 * */
export function isString (val: unknown): val is string {
  return is(val, 'String')
}

/**
 * 判断是否是一个布尔值
 * */
export function isBoolean (val: unknown): val is boolean {
  return is(val, 'Boolean')
}

/**
 * 判断是否是一个数字
 * */
export function isNumber (val: unknown): val is number {
  return is(val, 'Number')
}

/**
 * 判断是否是一个Map
 * */
export function isMap (val: unknown): val is Map<any, any> {
  return is(val, 'Map')
}

/**
 * 判断是否是一个正则表达式
 * */

export function isRegexp (val: unknown): val is RegExp {
  return val instanceof RegExp
}

/**
 * 判断是否是null
 * */
export function isNull (val: unknown): val is null {
  return val === null
}

/**
 * 判断是否是undefined
 * */
export function isUndef (val: unknown): val is undefined {
  return val === undefined
}

/**
 * 判断是否是null或者undefined
 * */
export function isNullOrUnDef (val: unknown): val is null | undefined {
  return isNull(val) || isUndef(val)
}

/**
 * 判断是否是null或者undefined或者''
 * */
export function isNullOrUndefOrEmpty (val: unknown) {
  return isNullOrUnDef(val) || val === '' || isEmpty(val)
}
export function isFormData (val: unknown) {
  return val !== null && is(val, 'FormData')
}
/**
 * 判断数组，字符串，Map，Set，object是否为空
 * */
export function isEmpty<T = any> (val: T): val is T {
  if (isArray(val) || isString(val)) {
    return val.length === 0
  }
  if (val instanceof Map || val instanceof Set) {
    return val.size === 0
  }
  if (isObj(val)) {
    return Object.keys(val).length === 0
  }
  return false
}

/**
 * 是否是Blob类型
 * */
export function isBlob (val: any) {
  return is(val, 'Blob')
}

/**
 * 检查传入的字符串是否为有效的HTTP或HTTPS URL。
 */
export function isHttpUrl (url?: string): boolean {
  if (!url) {
    return false
  }
  // 使用正则表达式测试URL是否以http:// 或 https:// 开头
  const httpRegex = /^https?:\/\/.*$/
  return httpRegex.test(url)
}
