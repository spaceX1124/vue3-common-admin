import { initForm, useZsForm } from '@/packages/Forms'

/**
 * 初始化表单适配器
 * */
initForm({
  // 组件的默认props
  defaultComponentProps: {
    clearable: true // 是否可以清空选项
  },
  // 组件绑定值的映射关系
  modelPropNameMap: {
    CheckboxGroup: 'checked',
    CheckboxGroupAll: 'checked',
    ApiCheckboxGroup: 'checked'
  },
  baseModelPropName: 'modelValue', // 绑定值名称-双向绑定底层机制
  config: {
    labelWidth: 120 // label的默认宽度
  }
})
// 引入表单组件
export const useForm = useZsForm
