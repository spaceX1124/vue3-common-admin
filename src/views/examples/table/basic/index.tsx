import type { ISchema } from '@/adapter'
import type { IGetFieldListParams } from '@/types/business.ts'
import businessList from '@/enums/business.ts'
import { select } from '@/libs/requestAddress.ts'

export function getFieldList1 ({ formMethods, tableMethods, searchMethods }: IGetFieldListParams):ISchema[] {
  // 需要哪个实例自己取，由于是一套json用于搜索，表格，表单，在使用实例的时候先加if判断，在处理业务逻辑
  return [
    {
      fieldKey: 'id',
      fieldName: 'ID',
      component: 'Input',
      useTable: true
    },
    {
      fieldKey: 'name',
      fieldName: '姓名',
      component: 'Input',
      useSearch: true,
      useTable: true
    },
    {
      fieldKey: 'sex',
      fieldName: '性别',
      component: 'Select',
      componentProps: {
        options: businessList.sexList
      },
      useTable: true,
      isEcho: true
    },
    {
      fieldKey: 'asyncName',
      fieldName: '异步姓名',
      component: 'ApiSelect',
      async: {
        url: select.selectList,
        method: 'post',
        label: 'name',
        value: 'id'
      },
      useTable: true,
      isEcho: true
    },
    {
      fieldKey: 'url',
      fieldName: '可复制URL',
      component: 'Input',
      useTable: true,
      isCopy: true
    },
    {
      fieldKey: 'words',
      fieldName: '超出省略号',
      component: 'Input',
      useTable: true
    }
  ]
}
