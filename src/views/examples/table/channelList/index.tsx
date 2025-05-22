import type { ISchema } from '@/adapter'
import type { FormMethods } from '@/packages/Forms'
import businessList from '@/enums/business.ts'
import { h } from 'vue'
import { moneyTransform } from '@/utils/unit.ts'
import { isArray, isEmpty, isNullOrUndefOrEmpty } from '@/utils/is.ts'
import RegExpEnum from '@/utils/regExp.ts'

export function getFieldList (baseFormApi?: FormMethods):ISchema[] {
  return [
    {
      fieldKey: 'id',
      fieldName: '渠道ID',
      component: 'Input',
      formHidden: true,
      search: true
    },
    {
      fieldKey: 'name',
      fieldName: '渠道名称',
      component: 'Input',
      search: true,
      componentProps: {
        maxlength: 10
      },
      required: true
    },
    {
      fieldKey: 'type',
      fieldName: '渠道类型',
      component: 'Select',
      componentProps: {
        options: businessList.channelType
      },
      search: true,
      formHidden: true,
      tableHidden: true
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
      required: true
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
      required: true
    },
    {
      fieldKey: 'registerPageId',
      fieldName: '注册页',
      component: 'Select',
      async: {
        url: '/bus/cms/channel-register-page/select-list',
        method: 'get',
        label: 'name',
        value: 'id',
        disabledOptions (data) {
          return data.status === 0
        }
      },
      tableHidden: true,
      required: true,
      async beforeMount (value) {
        // 刷新公司请求参数
        baseFormApi?.updateFieldProperty('registerPageId', 'async.data.id', value)
        const registerPageIdField = baseFormApi?.getField?.('registerPageId')
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
      }
    },
    {
      fieldKey: 'dailyAverageQuantity',
      fieldName: '日均客量',
      component: 'Input',
      tableHidden: true,
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
      tableHidden: true,
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
      tableHidden: true,
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
      tableHidden: true
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
      required: true
    },
    {
      fieldKey: 'createTime',
      fieldName: '创建时间',
      component: 'Input',
      formHidden: true
    }
  ]
}
