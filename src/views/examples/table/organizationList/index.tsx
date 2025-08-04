import type { ISchema } from '@/adapter'
import type { FormMethods } from '@/packages/Forms'
import businessList from '@/enums/business.ts'
import { h } from 'vue'
import { moneyTransform } from '@/utils/unit.ts'
import { isNullOrUndefOrEmpty } from '@/utils/is.ts'
import RegExpEnum from '@/utils/regExp.ts'
import { http } from '@/utils/http'
import type { IGetFieldListParams } from '@/types/business.ts'
const accountList = {
  recharge: '/bus/cms/account/recharge',
  refund: '/bus/cms/account/refund',
  sendCode: '/bus/cms/account/sendCode'
}

function visibleCooperateMode (formMethods?: FormMethods, value?: any) {
  formMethods?.updateFieldProperty('matchingUrl', 'formHidden', value !== '2') // API撞库地址
  formMethods?.updateFieldProperty('apiCode', 'formHidden', value !== '2') // API标识
  formMethods?.updateFieldProperty('registerUrl', 'formHidden', value !== '2') // API推送地址
}

// 表格字段
const tableField: ISchema[] = [
  {
    fieldKey: 'id',
    fieldName: '机构ID',
    component: 'Input',
    useTable: true
  },
  {
    fieldKey: 'name',
    fieldName: '机构名称',
    component: 'Input',
    useTable: true,
    useSearch: true
  },
  {
    fieldKey: 'id',
    fieldName: '机构ID',
    component: 'Input',
    useSearch: true
  },
  {
    fieldKey: 'simpleName',
    fieldName: '机构简称',
    component: 'Input',
    useTable: true,
    useSearch: true
  },
  {
    fieldKey: 'logo',
    fieldName: '机构logo',
    component: 'Upload',
    useTable: true
  },
  {
    fieldKey: 'status',
    fieldName: '机构状态',
    component: 'Select',
    componentProps: {
      options: businessList.channelStatus_
    },
    useTable: true,
    isEcho: true
  },
  {
    fieldKey: 'balance',
    fieldName: '机构余额',
    component: 'Input',
    useTable: true,
    cellRenderer: (obj) => {
      const { row } = obj
      return h('span', !isNullOrUndefOrEmpty(row.balance) ? moneyTransform(row.balance, 'fen', 'yuan') : '-')
    }
  },
  {
    fieldKey: 'createTime',
    fieldName: '创建时间',
    component: 'DatePicker',
    useTable: true
  }

]

// 充值，退款公共字段
const commonField: ISchema[] = [
  {
    fieldKey: 'name',
    fieldName: '机构名称',
    component: 'Input',
    useForm: true,
    componentProps: {
      disabled: true
    },
    notSend: true
  },
  {
    fieldKey: 'simpleName',
    fieldName: '机构简称',
    component: 'Input',
    useForm: true,
    componentProps: {
      disabled: true
    },
    notSend: true
  },
  {
    fieldKey: 'id',
    fieldName: '机构ID',
    component: 'Input',
    useForm: true,
    componentProps: {
      disabled: true
    },
    notSend: true
  },
  {
    fieldKey: 'account',
    fieldName: '主账号',
    component: 'Input',
    useForm: true,
    componentProps: {
      disabled: true
    },
    notSend: true
  }
]
// 新增机构字段
export function getFieldList1 ({ formMethods, tableMethods, searchMethods }: IGetFieldListParams):ISchema[] {
  return [
    ...tableField,
    {
      fieldKey: 'name',
      fieldName: '机构名称',
      component: 'Input',
      useForm: true,
      required: true,
      useSearch: true
    },
    {
      fieldKey: 'simpleName',
      fieldName: '机构简称',
      component: 'Input',
      useForm: true,
      required: true
    },
    {
      fieldKey: 'logo',
      fieldName: '机构logo',
      component: 'Upload',
      useForm: true,
      required: true
    },
    {
      fieldKey: 'account',
      fieldName: '机构主账号',
      component: 'Input',
      useForm: true,
      required: true,
      componentProps: {
        maxlength: '11'
      },
      rules: {
        regExp: RegExpEnum.phone,
        msg: '请输入正确的机构主账号'
      }
    },
    {
      fieldKey: 'accountName',
      fieldName: '主账号姓名',
      component: 'Input',
      useForm: true,
      required: true
    },
    {
      fieldKey: 'cooperateMode',
      fieldName: '合作方式',
      component: 'RadioGroup',
      componentProps: {
        options: businessList.cooperation,
        isButton: true
      },
      useForm: true,
      componentEvent: {
        change (value: any) {
          visibleCooperateMode(formMethods, value)
        }
      },
      beforeMount (value) {
        visibleCooperateMode(formMethods, value)
      }
    },
    {
      fieldKey: 'matchingUrl',
      fieldName: 'API撞库地址',
      component: 'Input',
      useForm: true,
      required: true,
      formHidden: true
    },
    {
      fieldKey: 'apiCode',
      fieldName: 'API标识',
      component: 'Input',
      useForm: true,
      required: true,
      formHidden: true
    },
    {
      fieldKey: 'registerUrl',
      fieldName: 'API推送地址',
      component: 'Input',
      useForm: true,
      required: true,
      formHidden: true
    },
    {
      fieldKey: 'status',
      fieldName: '机构状态',
      component: 'RadioGroup',
      componentProps: {
        options: businessList.channelStatus_,
        isButton: true
      },
      useForm: true
    },
    {
      fieldKey: 'businessLicense',
      fieldKeyArr: ['businessLicense', 'doorPhoto', 'sitePhoto', 'venueVideo', 'contractPhoto'],
      component: 'Upload',
      fieldName: '准入资料',
      useForm: true
    }
  ]
}
// 充值字段
export function getFieldList2 ({ formMethods, tableMethods, searchMethods }: IGetFieldListParams):ISchema[] {
  return [
    ...tableField,
    ...commonField,
    {
      fieldKey: 'amount',
      fieldName: '充值金额（元）',
      component: 'Input',
      componentProps: {
        placeholder: '请输入充值金额'
      },
      useForm: true,
      required: true,
      rules: {
        regExp: RegExpEnum.zero_99999,
        msg: '仅支持数字输入0<x<99999'
      },
      valueFormatter: {
        to: (value) => moneyTransform(value, 'yuan', 'fen'),
        from: (value) => moneyTransform(value, 'fen', 'yuan')
      }
    },
    {
      fieldKey: 'giftAmount',
      fieldName: '赠送金额（元）',
      component: 'Input',
      componentProps: {
        placeholder: '请输入赠送金额'
      },
      useForm: true,
      required: true,
      rules: (value) => {
        if (value === '0') {
          return true
        } else if (!RegExpEnum.zero_99999.test(value)) {
          return '仅支持数字输入0<x<99999'
        } else {
          return true
        }
      },
      valueFormatter: {
        to: (value) => moneyTransform(value, 'yuan', 'fen'),
        from: (value) => moneyTransform(value, 'fen', 'yuan')
      }
    },
    {
      fieldKey: 'remark',
      fieldName: '备注说明',
      component: 'Input',
      componentProps: {
        type: 'textarea',
        maxlength: '100'
      },
      useForm: true
    },
    {
      fieldKey: 'attachment',
      fieldName: '转账截图',
      component: 'Upload',
      useForm: true,
      required: true
    },
    {
      fieldKey: 'validateCode',
      fieldName: '验证码',
      component: 'Input',
      useForm: true,
      required: true,
      renderComponentSlotContent: () => {
        let codeDisabled = false
        async function getValidateCode () {
          if (codeDisabled) return
          await http.get(accountList.sendCode)
          codeDisabled = true
        }
        return {
          suffix: () => <p class='pointer text-primary' style={{ cursor: codeDisabled ? 'not-allowed' : 'pointer' }} onClick={() => getValidateCode()}>{ codeDisabled ? '已发送至钉钉' : '获取验证码' }</p>
        }
      }
    }
  ]
}
// 退款字段
export function getFieldList3 ({ formMethods }: IGetFieldListParams):ISchema[] {
  return [
    ...tableField,
    ...commonField,
    {
      fieldKey: 'balance',
      fieldName: '账户余额（元）',
      component: 'Input',
      useForm: true,
      valueFormatter: {
        to: (value) => moneyTransform(value, 'yuan', 'fen'),
        from: (value) => moneyTransform(value, 'fen', 'yuan')
      },
      componentProps: {
        disabled: true
      },
      notSend: true
    },
    {
      fieldKey: 'refundableBalance',
      fieldName: '可退款余额（元）',
      component: 'Input',
      useForm: true,
      valueFormatter: {
        to: (value) => moneyTransform(value, 'yuan', 'fen'),
        from: (value) => moneyTransform(value, 'fen', 'yuan')
      },
      componentProps: {
        disabled: true
      },
      notSend: true
    },
    {
      fieldKey: 'amount',
      fieldName: '退款金额（元）',
      component: 'Input',
      componentProps: {
        placeholder: '请输入退款金额'
      },
      useForm: true,
      required: true,
      rules: (value) => {
        const refundableBalance = formMethods?.getFieldValue('refundableBalance')
        if (!isNullOrUndefOrEmpty(value) && Number(value) > Number(refundableBalance)) {
          return '退款金额不能大于账户余额'
        } else if (!isNullOrUndefOrEmpty(value) && !RegExpEnum.positiveInteger.test(value)) {
          return '仅支持输入正整数'
        } else {
          return true
        }
      },
      valueFormatter: {
        to: (value) => moneyTransform(value, 'yuan', 'fen'),
        from: (value) => moneyTransform(value, 'fen', 'yuan')
      }
    },
    {
      fieldKey: 'remark',
      fieldName: '备注说明',
      component: 'Input',
      componentProps: {
        type: 'textarea',
        maxlength: '100'
      },
      useForm: true
    },
    {
      fieldKey: 'attachment',
      fieldName: '转账截图',
      component: 'Upload',
      useForm: true,
      required: true
    },
    {
      fieldKey: 'validateCode',
      fieldName: '验证码',
      component: 'Input',
      useForm: true,
      required: true,
      renderComponentSlotContent: () => {
        let codeDisabled = false
        async function getValidateCode () {
          if (codeDisabled) return
          await http.get(accountList.sendCode)
          codeDisabled = true
        }
        return {
          suffix: () => <p class='pointer text-primary' style={{ cursor: codeDisabled ? 'not-allowed' : 'pointer' }} onClick={() => getValidateCode()}>{ codeDisabled ? '已发送至钉钉' : '获取验证码' }</p>
        }
      }
    }
  ]
}
