import { defineComponent, h } from 'vue'
import FormComp from '../useForm.vue'
import { FormMethods, type IFormMethodsProps } from '../formMethods'
import type { IFormProps } from '../type'

export function useForm (options: IFormMethodsProps) {
  // 暴露给外部使用的一些方法
  const formMethods = new FormMethods(options)
  // 要渲染的表单
  const Form = defineComponent(
    (props: IFormProps, { attrs, slots }) => {
      // 将表单方法传递给表单组件
      return () => h(FormComp, { ...props, ...attrs, formMethods }, slots)
    })
  // 返回一个数组，第一个元素是表单组件，第二个元素是表单的方法
  return [Form, formMethods] as const // as const 解决类型问题，如使用在外部使用formMethods.submit()
}
