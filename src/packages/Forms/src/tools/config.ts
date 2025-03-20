import { globalShareState } from '@/global/globalState'
import { type Component } from 'vue'
import type { BaseFormComponentType, FormAdapterOptions } from '../type'
import { ApiSelect, CheckboxGroupAll } from '../components'

// 自定义组件
export const COMPONENT_MAP: Partial<Record<BaseFormComponentType, Component>> = {
  // 放一些自定义的组件
  ApiSelect,
  CheckboxGroupAll
}

const DEFAULT_MODEL_PROP_NAME = 'modelValue'

// 组件的默认配置-props
export const DEFAULT_COMPONENT_PROPS = {}

export const COMPONENT_BIND_EVENT_MAP: Partial<Record<BaseFormComponentType, string>> = {}

export let CONFIG: Record<string, any> = {}

export function setupForm (options?: FormAdapterOptions) {
  CONFIG = options?.config || {}
  Object.assign(DEFAULT_COMPONENT_PROPS, options?.defaultComponentProps || {})
  // 获取引入UI组件库中的一些组件
  const components = globalShareState.getComponents()

  // 双向绑定值的命名如：大部分的modelValue
  const baseModelPropName = options?.baseModelPropName ?? DEFAULT_MODEL_PROP_NAME
  const modelPropNameMap = options?.modelPropNameMap
  // 合并UI组件库组件和自定义组件
  for (const component of Object.keys(components)) {
    const key = component as BaseFormComponentType
    COMPONENT_MAP[key] = components[component as never]
    // 默认是modelValue，但是UI框架可能需要的是value，如ant-design-vue
    if (baseModelPropName !== DEFAULT_MODEL_PROP_NAME) {
      COMPONENT_BIND_EVENT_MAP[key] = baseModelPropName
    }

    // 覆盖特殊组件的modelPropName,如ant-design-vue的复选框就是checked，而不是modelValue
    if (modelPropNameMap && modelPropNameMap[key]) {
      COMPONENT_BIND_EVENT_MAP[key] = modelPropNameMap[key]
    }
  }

}