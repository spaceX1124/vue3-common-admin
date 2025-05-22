/**
 * 初始化表单功能如下：
 * 组件集合
 * 默认表单配置
 * 组件双向绑定机制
 * */
import { type Component, defineComponent } from 'vue'
import { globalShareState } from '@/global/globalState'
import type { FormAdapterOptions } from './type'
import { FormTitle } from './components'
import type { ComponentType } from '@/adapter/component'

// 默认双向绑定机制
const DEFAULT_MODEL_PROP_NAME = 'modelValue'

// 组件枚举集合
export const COMPONENT_MAP: Partial<Record<ComponentType, Component>> = {
  FormTitle
}
// 组件的默认prop属性配置
export const DEFAULT_COMPONENT_PROPS = {}
// 组件双向绑定语法糖需要的modelValue,如{CheckboxGroupAll: 'checked',Input: 'modelValue' }
export const COMPONENT_BIND_EVENT_MAP: Partial<Record<ComponentType, string>> = {}
export let CONFIG: Record<string, any> = {}

export function initForm (options?: FormAdapterOptions) {
  CONFIG = options?.config || {}
  // 合并组件的默认prop属性配置
  Object.assign(DEFAULT_COMPONENT_PROPS, options?.defaultComponentProps || {})

  // 获取组件适配器中自定义的组件集合
  const components = globalShareState.getComponents()
  // 双向绑定值的命名如：大部分的modelValue
  const baseModelPropName = options?.baseModelPropName ?? DEFAULT_MODEL_PROP_NAME
  const modelPropNameMap = options?.modelPropNameMap
  // 合并UI组件库组件和自定义组件
  for (const component of Object.keys(components)) {
    const key = component as ComponentType
    // 设置组件集合
    COMPONENT_MAP[key] = components[component as never]
    // 设置组件双向绑定update:[baseModelPropName]事件用到的绑定机制值
    COMPONENT_BIND_EVENT_MAP[key] = baseModelPropName

    if (modelPropNameMap && modelPropNameMap[key]) {
      // 覆盖特殊组件的modelPropName,如ant-design-vue的复选框就是checked，而不是modelValue
      COMPONENT_BIND_EVENT_MAP[key] = modelPropNameMap[key]
    }
  }
}