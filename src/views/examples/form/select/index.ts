import type { ISchema } from '@/adapter'
import type { FormMethods } from '@/packages/Forms'
export function getFieldList (baseFormApi: FormMethods):ISchema[] {
  return [
    {
      fieldKey: 'key1',
      fieldName: '普通单选',
      component: 'Select',
      componentProps: {
        options: [{ label: '篮球', value: 1 }, { label: '足球', value: 2 }]
      },
      useForm: true
    },
    {
      fieldKey: 'key2',
      fieldName: '普通多选',
      component: 'Select',
      componentProps: {
        options: [{ label: '篮球', value: 1 }, { label: '足球', value: 2 }],
        multiple: true
      },
      useForm: true
    },
    {
      fieldKey: 'key3',
      fieldName: '普通多选-禁用选项',
      component: 'Select',
      componentProps: {
        options: [{ label: '篮球', value: 1 }, { label: '足球', value: 2, disabled: true }, { label: '乒乓球', value: 3 }],
        multiple: true
      },
      useForm: true
    },
    {
      fieldKey: 'key4',
      fieldName: '异步单选',
      component: 'ApiSelect',
      async: {
        url: '/bus/cms/channel-register-page/select-list',
        method: 'get',
        label: 'name',
        value: 'id'
      },
      componentProps: {
        multiple: true
      },
      useForm: true
    },
    {
      fieldKey: 'key5',
      fieldName: '异步多选',
      component: 'ApiSelect',
      async: {
        url: '/bus/cms/channel-register-page/select-list',
        method: 'get',
        label: 'name',
        value: 'id'
      },
      componentProps: {
        multiple: true
      },
      useForm: true
    },
    {
      fieldKey: 'key6',
      fieldName: '异步多选-隐藏选项',
      component: 'ApiSelect',
      async: {
        url: '/bus/cms/channel-register-page/select-list',
        method: 'get',
        label: 'name',
        value: 'id',
        hiddenOptions (data) {
          return data.id === 7
        }
      },
      componentProps: {
        multiple: true
      },
      useForm: true
    },
    {
      fieldKey: 'key7',
      fieldName: '输入搜索',
      component: 'ApiSelect',
      async: {
        url: '/bus/cms/agency/select-list',
        method: 'get',
        label: 'name',
        value: 'id',
        remote: true,
        remoteKey: 'name'
      },
      useForm: true
    }
  ]
}
