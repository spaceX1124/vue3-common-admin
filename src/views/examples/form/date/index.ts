import type { ISchema } from '@/adapter'
import type { FormMethods } from '@/packages/ui/forms'
import dayjs from 'dayjs'
import { isArray } from '@/packages/utils/is'
import { ElMessage } from 'element-plus'
export function getFieldList (baseFormApi: FormMethods):ISchema[] {
  return [
    {
      fieldKey: 'key1',
      fieldName: '日期',
      component: 'DatePicker',
      componentProps: {
        type: 'date',
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYYMMDD'
      },
      useForm: true
    },
    {
      fieldKey: 'key2',
      fieldKeyArr: ['beginDate', 'endDate'],
      fieldName: '日期区间',
      component: 'DatePicker',
      componentProps: {
        type: 'daterange',
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYYMMDD'
      },
      useForm: true
    },
    {
      fieldKey: 'key3',
      fieldKeyArr: ['beginDate', 'endDate'],
      fieldName: '日期区间-跨度不能超过30天',
      component: 'DatePicker',
      componentProps: {
        type: 'daterange',
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYYMMDD'
      },
      componentEvent: {
        change: (value: any) => {
          if (isArray(value)) {
            if (dayjs(value[1]).diff(value[0], 'day') > 30) {
              ElMessage.error('时间跨度最长默认为30天')
              baseFormApi?.clearFieldValue('key3')
            }
          }
        }
      },
      useForm: true
    }
  ]
}
