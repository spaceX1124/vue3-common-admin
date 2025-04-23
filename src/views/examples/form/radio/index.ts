import type { ISchema } from '@/adapter'
import type { FormMethods } from '@/packages/Forms'
export function getFieldList (baseFormApi: FormMethods):ISchema[] {
  return [
    {
      fieldKey: 'key1',
      component: 'RadioGroup',
      fieldName: '单选',
      componentProps: {
        options: [
          {
            label: '篮球',
            value: 1
          },
          {
            label: '足球',
            value: 2
          }
        ]
      },
      required: true
    },

    {
      fieldKey: 'key2',
      component: 'RadioGroup',
      fieldName: '异步单选（隐藏选项）',
      async: {
        // 需要异步数据
        url: '/api/hobbyList', // 接口地址
        method: 'post', // 请求方法
        label: 'title', // list对应的label取对应的字段
        value: 'id', // list对应的value取对应的字段
        data: { type: 1 },
        hiddenOptions: (data: any) => {
          return data.id === 3
        }
      },
      required: true
    },
    {
      fieldKey: 'key3',
      component: 'RadioGroup',
      fieldName: '异步单选（禁用选项）',
      componentProps: {
        isButton: true
      },
      async: {
        // 需要异步数据
        url: '/api/hobbyList', // 接口地址
        method: 'post', // 请求方法
        label: 'title', // list对应的label取对应的字段
        value: 'id', // list对应的value取对应的字段
        data: { type: 1 },
        disabledOptions: (data: any) => {
          return data.id === 3
        }
      },
      required: true,
      componentEvent: {
        change: (value: any) => {
          const field = baseFormApi.getField('key3')
          console.log(field, 'field')
        }
      }
    }
  ]
}
