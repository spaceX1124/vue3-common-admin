import type { ISchema } from '@/adapter'
import type { FormMethods } from '@/packages/ui/forms'
import { isArray, isNullOrUndefOrEmpty } from '@/packages/utils/is'
import RegExpEnum from '@/packages/utils/regExp'
export function getFieldList (baseFormApi: FormMethods):ISchema[] {
  return [
    {
      fieldKey: 'key1',
      fieldKeyArr: ['first1', 'last1'],
      fieldName: '贷款金额(只校验必填)',
      component: 'IntervalInput',
      required: true,
      extraConfig: {
        minPlaceholder: '请输入最小金额',
        maxPlaceholder: '请输入最大金额'
      },
      useForm: true
    },
    {
      fieldKey: 'key2',
      fieldKeyArr: ['first2', 'last2'],
      fieldName: '贷款金额(整数且最小值不能大于最大值)',
      component: 'IntervalInput',
      required: true,
      rules: (value) => {
        if (isArray(value)) {
          if (!RegExpEnum.integer.test(value[0]) || !RegExpEnum.integer.test(value[1])) {
            return '请输入整数'
          } else if(Number(value[1]) < Number(value[0])) {
            return '最大金额不能小于最小金额'
          } else {
            return true
          }
        } else {
          return true
        }
      },
      extraConfig: {
        minPlaceholder: '请输入最小金额',
        maxPlaceholder: '请输入最大金额'
      },
      useForm: true
    },
    {
      fieldKey: 'key3',
      fieldKeyArr: ['first3', 'last3'],
      fieldName: '贷款金额（不做任何限制）',
      component: 'IntervalInput',
      extraConfig: {
        minPlaceholder: '请输入最小金额',
        maxPlaceholder: '请输入最大金额'
      },
      useForm: true
    },
    {
      fieldKey: 'key4',
      fieldKeyArr: ['first4', 'last4'],
      fieldName: '贷款金额（不必填，但是填了就都要填,限制输入格式）',
      component: 'IntervalInput',
      extraConfig: {
        minPlaceholder: '请输入最小金额',
        maxPlaceholder: '请输入最大金额'
      },
      rules: (value) => {
        if (isArray(value)) {
          if (isNullOrUndefOrEmpty(value[0]) || isNullOrUndefOrEmpty(value[1])) {
            return '请填写完整'
          } else if (!RegExpEnum.integer.test(value[0]) || !RegExpEnum.integer.test(value[1])) {
            return '请输入整数'
          } else {
            return true
          }
        } else {
          return true
        }
      },
      useForm: true
    },
    {
      fieldKey: 'key5',
      fieldKeyArr: ['first5', 'last5'],
      fieldName: '贷款金额（不必填，但是填了就都要填,不限制输入格式）',
      component: 'IntervalInput',
      extraConfig: {
        minPlaceholder: '请输入最小金额',
        maxPlaceholder: '请输入最大金额'
      },
      rules: (value) => {
        console.log(value, 'value111')
        if (isArray(value)) {
          if (isNullOrUndefOrEmpty(value[0]) || isNullOrUndefOrEmpty(value[1])) {
            return '请填写完整'
          } else {
            return true
          }
        } else {
          return true
        }
      },
      useForm: true
    }
  ]
}
