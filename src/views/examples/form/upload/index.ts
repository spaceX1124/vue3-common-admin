import type { ISchema } from '@/adapter'
import type { FormMethods } from '@/packages/ui/forms'

export function getFieldList (baseFormApi: FormMethods):ISchema[] {
  return [
    {
      fieldKey: 'key1',
      component: 'Upload',
      fieldName: '上传单张',
      useForm: true
    },
    {
      fieldKey: 'key2',
      component: 'Upload',
      fieldName: '上传3张',
      useForm: true,
      componentProps: {
        multiple: true, // 支持同时选多张
        limit: 3
      }
    }
  ]
}
