import type { ISchema } from '@/adapter'
import type { FormMethods } from '@/packages/Forms'
export function getFieldList (baseFormApi: FormMethods):ISchema[] {
  return [
    {
      fieldKey: 'hobby1',
      component: 'Select',
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
      fieldKey: 'hobby2',
      component: 'Select',
      fieldName: '多选',
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
        ],
        multiple: true
      },
      required: true
    },
    {
      fieldKey: 'hobby21',
      component: 'Select',
      fieldName: '多选+1',
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
        ],
        multiple: true,
        collapseTags: true
      },
      required: true
    },
    {
      fieldKey: 'hobby3',
      component: 'Select',
      fieldName: '异步下拉',
      required: true,
      async: {
        // 需要异步数据
        url: '/api/hobbyList', // 接口地址
        method: 'post', // 请求方法
        label: 'title', // list对应的label取对应的字段
        value: 'id', // list对应的value取对应的字段
        data: { type: 1 }
      },
      componentEvent: {
        onChange: (e: any) => {

          // @todo 不仅要拿到选中值，还要拿到下拉list,或者当前选中项的数据
          console.log(e, 'change')
          // 更新hobby5字段请求接口时需要的参数
          baseFormApi.updateFieldProperty('hobby5', 'async.data.hobby3', e)
          // 如果hobby5已经有值才去清空
          // 清空hobby5已选值
          if (baseFormApi.getValues().hobby5) {
            baseFormApi.setFieldValue('hobby5', '')
          }
        }
      }
    },
    {
      fieldKey: 'hobby4',
      component: 'Select',
      fieldName: '关键词输入请求',
      required: true,
      async: {
        // 需要异步数据
        url: '/api/hobbyList', // 接口地址
        method: 'post', // 请求方法
        label: 'title', // list对应的label取对应的字段
        value: 'id', // list对应的value取对应的字段
        data: { type: 1 },
        remote: true,
        remoteKey: 'keyWord'
      },
      componentEvent: {
        focus: (e: any) => {
          console.log(e, 'focus')
        }
      }
    },
    {
      fieldKey: 'hobby5',
      component: 'Select',
      fieldName: '关键词输入请求依赖异步下拉选中值',
      required: true,
      async: {
        // 需要异步数据
        url: '/api/hobbyList', // 接口地址
        method: 'post', // 请求方法
        label: 'title', // list对应的label取对应的字段
        value: 'id', // list对应的value取对应的字段
        data: { type: 1 },
        remote: true,
        remoteKey: 'keyWord'
      },
      componentEvent: {
        focus: (e: any) => {
          console.log(e, 'focus')

        }
      }
    },
    {
      fieldKey: 'hobby6',
      component: 'Select',
      fieldName: '禁用某一个选项（异步）',
      required: true,
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
      }
    }
  ]
}
