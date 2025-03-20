import { getCurrentInstance, inject, provide } from 'vue'
import type { FormProvider } from '@/packages/Forms/src/type'

const formContextKey = Symbol('formContext')
/**
 * Provide Menu context，为组件后代提供数据，
 * */
export function createFormContext (injectMenuData: FormProvider) {
  provide(formContextKey, injectMenuData)
}

/**
 * Inject Menu context，注入上层组件提供的数据
 */
export function useFormContext () {
  // 获取组件实例
  const instance = getCurrentInstance()
  if (!instance) {
    throw new Error('instance is required')
  }
  // 使用泛型参数确保类型正确
  const context = inject<FormProvider>(formContextKey)
  if (!context) {
    throw new Error('formContext not provided')
  }
  return context
}