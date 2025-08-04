import type { ISchema } from '@/adapter'
import businessList from '@/enums/business.ts'
import { h } from 'vue'
import { moneyTransform } from '@/utils/unit.ts'
import { isArray, isEmpty, isNullOrUndefOrEmpty } from '@/utils/is.ts'
import RegExpEnum from '@/utils/regExp.ts'
import type { IGetFieldListParams } from '@/types/business.ts'

export function getFieldList ({ formMethods, tableMethods, searchMethods }: IGetFieldListParams):ISchema[] {
  return [
    {
      fieldKey: 'id',
      fieldName: '渠道ID',
      component: 'Input',
      useSearch: true,
      useTable: true
    },
    {
      fieldKey: 'name',
      fieldName: '渠道名称',
      component: 'Input',
      useSearch: true,
      useTable: true,
      useForm: true,
      componentProps: {
        maxlength: 10
      },
      required: true,
      isCopy: true
    },
    {
      fieldKey: 'type',
      fieldName: '渠道类型',
      component: 'Select',
      componentProps: {
        options: businessList.channelType
      },
      useSearch: true
    },
    {
      fieldKey: 'type',
      fieldName: '渠道类型',
      component: 'RadioGroup',
      componentProps: {
        options: businessList.channelType,
        isButton: true
      },
      isEcho: true,
      required: true,
      useTable: true,
      useForm: true
    },
    {
      fieldKey: 'dockingType',
      fieldName: '对接类型',
      component: 'RadioGroup',
      componentProps: {
        options: businessList.djType,
        isButton: true
      },
      isEcho: true,
      required: true,
      useTable: true,
      useForm: true
    },
    {
      fieldKey: 'registerPageId',
      fieldName: '注册页',
      component: 'ApiSelect',
      async: {
        url: '/bus/cms/channel-register-page/select-list',
        method: 'get',
        label: 'name',
        value: 'id',
        disabledOptions (data) {
          return data.status === 0
        }
      },
      useForm: true,
      required: true,
      async beforeMount (value) {
        // 刷新公司请求参数
        formMethods?.updateFieldProperty('registerPageId', 'async.data.id', value)
        const registerPageIdField = formMethods?.getField?.('registerPageId')
        const registerPageIdRefresh = registerPageIdField?.insideComp?.refresh
        if (registerPageIdRefresh) await registerPageIdRefresh()// 刷新注册页下拉数据
      }
    },
    {
      fieldKey: 'paymentType',
      fieldKeyArr: ['paymentType', 'paymentTypeValue'],
      component: 'RadioGroup',
      fieldName: '结算方式',
      componentProps: {
        options: businessList.jsType,
        isButton: true
      },
      useTable: true,
      useForm: true,
      cellRenderer: ({ row }) => {
        const { paymentType, paymentTypeValue } = row
        const jsName = businessList.jsType.find((item) => item.value === paymentType)
        return h('span', `${jsName?.label}，${moneyTransform(paymentTypeValue, 'fen', 'yuan')}`)
      },
      required: true,
      rules (value) {
        console.log(value, 'value11')
        if(isArray(value)) {
          if (isNullOrUndefOrEmpty(value[0])) {
            return '请选择结算方式'
          } else if(value[0] === '1' && isNullOrUndefOrEmpty(value[1])) {
            return '请输入单价'
          } else if (value[0] === '1' && !RegExpEnum.zero_999.test(value[1])) {
            return '仅支持数字输入0<x<999'
          } else {
            return true
          }
        } else {
          return true
        }
      },
      valueFormatter: {
        to: (value) => {
          if (value.index === 1) {
            return moneyTransform(value.val, 'yuan', 'fen')
          } else {
            return value.val
          }
        },
        from: (value) => {
          if (value.index === 1) {
            return moneyTransform(value.val, 'fen', 'yuan')
          } else {
            return value.val
          }
        }
      }
    },
    {
      fieldKey: 'dailyAverageQuantity',
      fieldName: '日均客量',
      component: 'Input',
      useForm: true,
      componentProps: {
        placeholder: '请输入每日想吸引客户的数量'
      },
      rules: {
        regExp: RegExpEnum.zero_9999,
        msg: '仅支持数字输入，0<x<9999'
      }
    },
    {
      fieldKey: 'filterType',
      fieldName: '撞库类型',
      component: 'RadioGroup',
      componentProps: {
        options: businessList.zkType,
        isButton: true
      },
      useForm: true,
      required: true
    },
    {
      fieldKey: 'filterCapitalType',
      fieldName: '撞库类型筛选',
      component: 'Select',
      componentProps: {
        options: businessList.filterTypeType,
        multiple: true
      },
      useForm: true,
      required: true
    },
    {
      fieldKey: 'capitalType',
      fieldName: '资质核实',
      component: 'Select',
      componentProps: {
        options: businessList.shzzType,
        multiple: true
      },
      useForm: true
    },
    {
      fieldKey: 'onlinePeriod',
      fieldKeyArr: ['onlinePeriod', 'onlinePeriodValue'],
      fieldName: '上线时段',
      component: 'RadioGroup',
      componentProps: {
        options: businessList.onlineType,
        isButton: true
      },
      required: true,
      useTable: true,
      useForm: true,
      rules (value) {
        // 这儿还要校验复选框的值，还有，复选框的值怎么设置到表单数据中
        if(isArray(value)) {
          if (isNullOrUndefOrEmpty(value[0])) {
            return '请选择上线时段'
          } else if(value[0] === '3' && (isNullOrUndefOrEmpty(value[1]) || isEmpty(value[1]))) {
            return '请选择自定义上线时段'
          } else {
            return true
          }
        } else {
          return true
        }
      },
      cellRenderer: ({ row }) => {
        const { onlinePeriod, onlinePeriodValue } = row
        const jsName = businessList.onlineType_.find((item) => item.value === onlinePeriod)
        return h(
          'span',
          jsName
            ? onlinePeriod === 3
              ? `${jsName.text}（${
                        onlinePeriodValue
                          ? onlinePeriodValue
                          .split(',')
                          .sort((a: any, b: any) => a - b)
                          .join(',')
                          : ''
                    }）`
              : jsName.text
            : '-'
        )
      }
    },
    {
      fieldKey: 'onlineCycle',
      fieldName: '上线周期',
      fieldKeyArr: ['onlineCycle', 'onlineCycleValue'],
      component: 'RadioGroup',
      componentProps: {
        options: businessList.cycleType,
        isButton: true
      },
      useTable: true,
      useForm: true,
      required: true,
      cellRenderer: ({ row }) => {
        const { onlineCycle, onlineCycleValue } = row
        const jsName = businessList.cycleType_.find((item) => item.value === onlineCycle)
        return h(
          'span',
          jsName ? (onlineCycle === 4 ? `${jsName.label}（${onlineCycleValue}）` : jsName.label) : '-'
        )
      },
      rules (value) {
        // 这儿还要校验复选框的值，还有，复选框的值怎么设置到表单数据中
        if(isArray(value)) {
          if (isNullOrUndefOrEmpty(value[0])) {
            return '请选择上线周期'
          } else if(value[0] === '4' && (isNullOrUndefOrEmpty(value[1]) || isEmpty(value[1]))) {
            return '请选择自定义上线周期'
          } else {
            return true
          }
        } else {
          return true
        }
      }
    },
    {
      fieldKey: 'status',
      fieldName: '渠道状态',
      component: 'RadioGroup',
      componentProps: {
        options: businessList.channelStatus_,
        isButton: true
      },
      isEcho: true,
      required: true,
      useTable: true,
      useForm: true
    },
    {
      fieldKey: 'createTime',
      fieldName: '创建时间',
      component: 'Input',
      useTable: true
    }
  ]
}
