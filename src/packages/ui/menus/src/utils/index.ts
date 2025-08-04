import { type ComponentInternalInstance } from 'vue'
/**
 * 根据当前传入的组件向上查找，只要当前实例的父级的name不在parentNames中，就继续向上查找，满足在parentNames为止
 * @param instance
 * @param parentNames
 */
export function findComponentUpward (
  instance: ComponentInternalInstance,
  parentNames: string[]
) {
  let parent = instance.parent
  while (parent && !parentNames.includes(parent?.type?.name ?? '')) {
    parent = parent.parent
  }
  return parent
}
