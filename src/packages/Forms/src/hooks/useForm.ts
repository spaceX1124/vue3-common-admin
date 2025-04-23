import { defineComponent, h } from 'vue'
import FormComp from '../useForm.vue'
import { FormMethods, type IFormMethodsProps } from '../formMethods'
import type { IFormProps } from '../type'

/**
 * 创建一个带有自定义方法的表单
 * @param options 表单方法的配置属性
 * @returns 返回一个带有表单组件和表单方法的数组
 *
 * 此函数用于初始化一个表单及其相关方法它接受一个配置对象作为参数，
 * 该配置对象用于定制表单的行为函数返回一个数组，其中包含一个表单组件和一组表单方法，
 * 如提交、验证等这些方法可以通过`formMethods`对象访问
 */
export function useForm (options: IFormMethodsProps) {
  // 暴露给外部使用的一些方法
  const formMethods = new FormMethods(options)
  // 要渲染的表单
  const Form = defineComponent(
    (props: IFormProps, { attrs, slots }) => {
      // 将表单方法传递给表单组件
      return () => h(FormComp, { ...props, ...attrs, formMethods }, slots)
    })
  // 返回一个数组，第一个元素是表单组件，第二个元素是表单的方法(外面使用的时候不要去解构这个方法，会导致this指向问题)
  return [Form, formMethods] as const // as const 解决类型问题，如使用在外部使用formMethods.submit()
}
