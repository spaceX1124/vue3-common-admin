import type { ISchema } from '@/adapter'
import type { FormMethods } from '@/packages/Forms'
import { select } from '@/libs/requestAddress.ts'
export function getFieldList (baseFormApi: FormMethods):ISchema[] {
  return [
    {
      fieldKey: 'key1',
      component: 'CheckboxGroup',
      fieldName: '普通多选',
      componentProps: {
        options: [{ label: '篮球', value: 1 }, { label: '足球', value: 2 }]
      },
      useForm: true,
      required: true
    },
    {
      fieldKey: 'key2',
      component: 'CheckboxGroup',
      fieldName: '普通多选-禁用',
      componentProps: {
        options: [{ label: '篮球', value: 1 }, { label: '足球', value: 2, disabled: true }]
      },
      useForm: true,
      required: true
    },
    {
      fieldKey: 'key3',
      component: 'CheckboxGroup',
      fieldName: '普通多选按钮',
      componentProps: {
        options: [{ label: '篮球', value: 1 }, { label: '足球', value: 2 }],
        isButton: true
      },
      useForm: true,
      required: true
    },
    {
      fieldKey: 'key4',
      component: 'ApiCheckboxAll',
      fieldName: '多选-带全选',
      componentProps: {
        options: [{ label: '篮球', value: 1 }, { label: '足球', value: 2 }]
      },
      extraConfig: {
        isAll: true
      },
      useForm: true,
      required: true
    },
    {
      fieldKey: 'key5',
      component: 'ApiCheckboxAll',
      fieldName: '异步多选',
      async: {
        url: select.selectList,
        method: 'post',
        label: 'name',
        value: 'id'
      },
      useForm: true,
      required: true
    },
    {
      fieldKey: 'key6',
      component: 'ApiCheckboxAll',
      fieldName: '异步多选-带全选',
      async: {
        url: select.selectList,
        method: 'post',
        label: 'name',
        value: 'id'
      },
      extraConfig: {
        isAll: true
      },
      useForm: true,
      required: true
    }
  ]
}
