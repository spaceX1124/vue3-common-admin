import type { ISchema } from '@/adapter'
import type { FormMethods } from '@/packages/ui/forms'
import { select } from '@/libs/requestAddress.ts'
export function getFieldList (baseFormApi: FormMethods):ISchema[] {
  return [
    {
      fieldKey: 'key1',
      fieldName: '普通单选',
      component: 'Select',
      componentProps: {
        options: [{ label: '篮球', value: 1 }, { label: '足球', value: 2 }]
      },
      useForm: true,
      required: true
    },
    {
      fieldKey: 'key2',
      fieldName: '普通多选',
      component: 'Select',
      componentProps: {
        options: [{ label: '篮球', value: 1 }, { label: '足球', value: 2 }],
        multiple: true
      },
      useForm: true,
      required: true
    },
    {
      fieldKey: 'key3',
      fieldName: '普通多选-禁用选项',
      component: 'Select',
      componentProps: {
        options: [{ label: '篮球', value: 1 }, { label: '足球', value: 2, disabled: true }, { label: '乒乓球', value: 3 }],
        multiple: true
      },
      useForm: true,
      required: true
    },
    {
      fieldKey: 'key4',
      fieldName: '异步单选',
      component: 'ApiSelect',
      async: {
        url: select.selectList,
        method: 'post',
        label: 'name',
        value: 'id'
      },
      componentProps: {
        multiple: true
      },
      useForm: true,
      required: true
    },
    {
      fieldKey: 'key5',
      fieldName: '异步多选（带参）',
      component: 'ApiSelect',
      async: {
        url: select.selectSearchList,
        method: 'post',
        label: 'name',
        value: 'id',
        data: {
          searchVal: '张'
        }
      },
      componentProps: {
        multiple: true
      },
      useForm: true,
      required: true
    },
    {
      fieldKey: 'key6',
      fieldName: '异步多选-隐藏选项',
      component: 'ApiSelect',
      async: {
        url: select.selectList,
        method: 'post',
        label: 'name',
        value: 'id',
        hiddenOptions (data) {
          return data.id === 2
        }
      },
      componentProps: {
        multiple: true
      },
      useForm: true,
      required: true
    },
    {
      fieldKey: 'key7',
      fieldName: '输入搜索（输入张）',
      component: 'ApiSelect',
      async: {
        url: select.selectSearchList,
        method: 'post',
        label: 'name',
        value: 'id',
        remote: true,
        remoteKey: 'searchVal'
      },
      useForm: true,
      required: true
    }
  ]
}
