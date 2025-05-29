import type { ISchema } from '@/adapter'
import type { FormMethods } from '@/packages/Forms'
export function getFieldList (baseFormApi: FormMethods):ISchema[] {
  return [
    {
      fieldKey: 'key1',
      component: 'RadioGroup',
      fieldName: '普通单选',
      componentProps: {
        options: [{ label: '篮球', value: 1 }, { label: '足球', value: 2 }, { label: '乒乓球', value: 3 }]
      },
      useForm: true
    },
    {
      fieldKey: 'key2',
      component: 'RadioGroup',
      fieldName: '普通单选-禁用选项',
      componentProps: {
        options: [{ label: '篮球', value: 1 }, { label: '足球', value: 2, disabled: true }, { label: '乒乓球', value: 3 }]
      },
      useForm: true
    },
    {
      fieldKey: 'key3',
      component: 'RadioGroup',
      fieldName: '普通单选按钮',
      componentProps: {
        options: [{ label: '篮球', value: 1 }, { label: '足球', value: 2 }, { label: '乒乓球', value: 3 }],
        isButton: true
      },
      useForm: true
    },
    {
      fieldKey: 'key4',
      component: 'ApiRadioGroup',
      fieldName: '单选-可取消选中',
      componentProps: {
        options: [{ label: '篮球', value: 1 }, { label: '足球', value: 2 }, { label: '乒乓球', value: 3 }]
      },
      useForm: true
    },
    {
      fieldKey: 'key5',
      component: 'ApiRadioGroup',
      fieldName: '异步单选',
      async: {
        url: '/bus/cms/channel-register-page/select-list',
        method: 'get',
        label: 'name',
        value: 'id'
      },
      useForm: true
    }
  ]
}
