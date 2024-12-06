/**
 * diff算法比较2个值是否一致
 * */
function deepEqual (a: any, b: any): boolean {
  if (a === b) return true // 如果是相同引用或基本类型相等
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false

  const keysA = Object.keys(a)
  const keysB = Object.keys(b)

  if (keysA.length !== keysB.length) return false

  for (const key of keysA) {
    if (!keysB.includes(key) || !deepEqual(a[key], b[key])) {
      return false
    }
  }

  return true
}

function arraysEqual<T> (a: T[], b: T[]): boolean {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (!deepEqual(a[i], b[i])) {
      return false
    }
  }

  return true
}

type DiffResult<T> = Partial<{
  [K in keyof T]: T[K] extends object ? DiffResult<T[K]> : T[K];
}>;

export function diff<T extends Record<string, any>> (obj1: T, obj2: T): DiffResult<T> | true {
  function findDifferences (o1: any, o2: any): any {
    if (Array.isArray(o1) && Array.isArray(o2)) {
      return arraysEqual(o1, o2) ? true : undefined
    }

    if (typeof o1 === 'object' && typeof o2 === 'object' && o1 !== null && o2 !== null) {
      const diffResult: any = {}

      const keys = new Set([...Object.keys(o1), ...Object.keys(o2)])
      keys.forEach((key) => {
        const valueDiff = findDifferences(o1[key], o2[key])
        if (valueDiff !== true) {
          diffResult[key] = valueDiff
        }
      })

      return Object.keys(diffResult).length > 0 ? diffResult : true
    }

    return o1 === o2 ? true : o2
  }

  return findDifferences(obj1, obj2)
}