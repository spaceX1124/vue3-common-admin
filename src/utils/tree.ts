import { isFunc, isBoolean } from '@/utils/is'

/**
 * 树形数据的一些操作方法
 * */

interface TreeConfigOptions {
  // 子属性的名称，默认为'children'
  childProps: string;
}

/**
 * 通用递归
 * */
export function forInTree<T extends Record<string, any>> (list: T[], fn: Fn, options?: TreeConfigOptions){
  const { childProps } = options || {
    childProps: 'children'
  }
  const recursionFn = (arr: T[], parent?: T) => {
    let interruptFlag = false // 中断递归标志
    for (const item of arr) {
      interruptFlag = isFunc(fn) ? fn(item, parent) : false
      if (isBoolean(interruptFlag) && interruptFlag) { // 当函数返回布尔值且为true时,中断递归
        return true
      } else {
        interruptFlag = recursionFn(item[childProps] || [], item) || false
        if (isBoolean(interruptFlag) && interruptFlag) { // 当函数返回布尔值且为true时,中断递归
          return true
        }
      }
    }
  }
  recursionFn(list)
}

/**
 * 根据条件过滤给定树结构的节点，并以原有顺序返回所有匹配节点的数组。
 * @param tree 要过滤的树结构的根节点数组。
 * @param filter 用于匹配每个节点的条件。filter函数返回false的项就过滤掉了
 * @param options 作为子节点数组的可选属性名称。
 * @returns 包含所有匹配节点的数组。
 */

export function filterTree<T extends Record<string, any>> (
  tree: T[],
  filter: (node: T) => boolean,
  options?: TreeConfigOptions
): T[] {
  const { childProps } = options || {
    childProps: 'children'
  }

  const _filterTree = (nodes: T[]): T[] => {
    return nodes.filter((node: Record<string, any>) => {
      if (filter(node as T)) {
        if (node[childProps]) {
          node[childProps] = _filterTree(node[childProps])
        }
        return true
      }
      return false
    })
  }

  return _filterTree(tree)
}

/**
 * 根据条件重新映射给定树结构的节，即将树形结构的每一项改为按照mapper函数返回值
 * @param tree 要过滤的树结构的根节点数组。
 * @param mapper 用于map每个节点的条件。
 * @param options 作为子节点数组的可选属性名称。
 * @param parent 当前节点的父节点
 * @param level 当前层级
 */
export function mapTree<T, V extends Record<string, any>> (
  tree: T[],
  mapper: (node: T, parent?: T, level?: number) => V,
  options?: TreeConfigOptions,
  parent?: T,
  level: number = 0
): V[] {
  const { childProps } = options || {
    childProps: 'children'
  }
  return tree.map((node) => {
    const mapperNode: Record<string, any> = mapper(node, parent, level)
    if (mapperNode[childProps]) {
      mapperNode[childProps] = mapTree(mapperNode[childProps], mapper, options, node, level + 1)
    }
    return mapperNode as V
  })
}

/**
 * @zh_CN 遍历树形结构，并返回所有节点中指定的值。如，getValue函数返回每一项的id，将会得到[1,2,3...]
 * @param tree 树形结构数组
 * @param getValue 获取节点值的函数
 * @param options 作为子节点数组的可选属性名称。
 * @returns 所有节点中指定的值的数组
 */
export function traverseTreeValues<T, V> (
  tree: T[],
  getValue: (node: T) => V,
  options?: TreeConfigOptions
): V[] {
  const result: V[] = []
  const { childProps } = options || {
    childProps: 'children'
  }

  const dfs = (treeNode: T) => {
    const value = getValue(treeNode)
    result.push(value)
    const children = (treeNode as Record<string, any>)?.[childProps]
    if (!children) {
      return
    }
    if (children.length > 0) {
      for (const child of children) {
        dfs(child)
      }
    }
  }

  for (const treeNode of tree) {
    dfs(treeNode)
  }
  return result.filter(Boolean)
}

/**
 * 树形扁平化
 * */
export function getFlatTree<T extends Record<string, any>> (
  arr: T[],
  options?: TreeConfigOptions
): T[] {
  const { childProps } = options || {
    childProps: 'children'
  }
  return arr.reduce((pre: T[], current: T) => {
    let flatArr: T[] = [...pre, current]
    if (current[childProps]) flatArr = [...flatArr, ...getFlatTree<T>(current[childProps], options)]
    return flatArr
  }, [])
}
