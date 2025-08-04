/**
 * 处理表单错误校验内容
 * */

import { inject, type InjectionKey } from 'vue'

import {
  FieldContextKey,
  useFieldError,
  useIsFieldDirty,
  useIsFieldTouched,
  useIsFieldValid
} from 'vee-validate'

export function useFormFieldValidate () {
  const fieldContext = inject(FieldContextKey)

  if (!fieldContext)
    throw new Error('useFormFieldValidate should be used within <FormField>')

  const { name } = fieldContext

  const fieldState = {
    error: useFieldError(name),
    isDirty: useIsFieldDirty(name),
    isTouched: useIsFieldTouched(name),
    valid: useIsFieldValid(name)
  }

  return {
    name,
    ...fieldState
  }
}
