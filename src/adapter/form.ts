import { setupForm, useZsForm } from '@/packages/Forms'

setupForm({
  // 组件的默认props
  defaultComponentProps: {
    clearable: true // 是否可以清空选项
  },
  modelPropNameMap: {
    CheckboxGroup: 'checked',
    CheckboxGroupAll: 'checked',
    ApiCheckboxGroup: 'checked'
  },
  baseModelPropName: 'modelValue',
  config: {
    labelWidth: 120
  }
})
// 引入表单组件
export const useForm = useZsForm
