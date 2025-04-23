import type { ComponentType, ISchema } from '@/adapter'
export type { FormMethods } from './formMethods'
import { type Ref, type Component } from 'vue'
import type { FormContext } from 'vee-validate'

export interface IFormProps {
    // 这儿可以扩展，后期如果需要再组件标签上传递属性
    // a: number;
}

/**
 * rules: async (value) => {
 *  await setTimeFn()
 *  return '错了赛'
 *}
 * */

// 表单有这些组件
// 'customComp'自定义的，到时候根据自定义的组件命名去更改
export type BaseFormComponentType = 'CustomComp' | ComponentType

export interface FormProvider {
    componentMap: Partial<Record<BaseFormComponentType, Component>>; // 组件集合
    defaultComponentProps: Record<string, any>; // 组件的默认配置-props
    componentBindEventMap:Partial<Record<BaseFormComponentType, string>>; // 组件双向绑定需要的名称如modelValue
    config: Record<string, any>;
    formMethods: FormMethods
}

/**
 * 表单地默认配置
 * */
export interface FormAdapterOptions {
  defaultComponentProps?: Record<string, any>; // 组件的默认配置-props
  baseModelPropName?: string; // 绑定值名称-双向绑定底层机制
  modelPropNameMap?: Partial<Record<BaseFormComponentType, string>>; // 自定义双向绑定名称
  config?: {
    labelWidth?: number;
  }
}