import { initForm, useZsForm } from '@/packages/Forms'

/**
 * 初始化表单适配器
 * */
initForm({
  // 组件的默认props
  defaultComponentProps: {
    clearable: true, // 是否可以清空选项
    class: 'w-full'
  },
  // 组件绑定值的映射关系
  /**
   * <CheckboxGroup
   *           v-model:checked="inputVal[1]"
   *           :options="popoverShowList"
   *           :schema="{
   *             extraConfig: {
   *               isAll: true
   *             }
   *           }"
   *           @change="changeCheckbox"
   *         />
   * */
  modelPropNameMap: {
    CheckboxGroup: 'modelValue' // ant-design-vue用checked
  },
  baseModelPropName: 'modelValue', // 绑定值名称-双向绑定底层机制
  config: {
    labelWidth: 120 // label的默认宽度
  }
})
// 引入表单组件
export const useForm = useZsForm
