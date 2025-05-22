import type { ISchema } from '@/adapter'
import RegExpEnum from '@/utils/regExp'

export const fieldList: ISchema[] = [
  {
    fieldKey: 'FormTitle',
    component: 'FormTitle',
    fieldName: '标题1'
  },
  {
    fieldKey: 'name1',
    component: 'Input',
    fieldName: '普通输入',
    componentProps: {
      placeholder: '无限制'
    },
    required: true
  },
  {
    fieldKey: 'name2',
    component: 'Input',
    fieldName: '禁用',
    componentProps: {
      placeholder: '禁用',
      disabled: true
    }
  },
  {
    fieldKey: 'name3',
    component: 'Input',
    fieldName: '必填标识但禁用',
    componentProps: {
      placeholder: '需求：该字段值由后端生成，新增不校验不显示，编辑的时候会显示',
      disabled: true
    },
    required: true
  },
  {
    fieldKey: 'name4',
    component: 'Input',
    fieldName: '纯数字',
    componentProps: {
      placeholder: '校验纯数字'
    },
    rules: {
      regExp: RegExpEnum.number,
      msg: '请输入数字'
    },
    required: true
  },
  {
    fieldKey: 'name5',
    component: 'Input',
    fieldName: '整数',
    componentProps: {
      placeholder: '校验整数（可以为负数和零）'
    },
    rules: {
      regExp: RegExpEnum.integer,
      msg: '请输入整数'
    },
    required: true
  },
  {
    fieldKey: 'name6',
    component: 'Input',
    fieldName: '正整数',
    componentProps: {
      placeholder: '校验正整数（不包括零）'
    },
    rules: {
      regExp: RegExpEnum.positiveInteger,
      msg: '请输入正整数'
    },
    required: true
  },
  {
    fieldKey: 'FormTitle',
    component: 'FormTitle',
    fieldName: '标题2'
  },
  {
    fieldKey: 'name7',
    component: 'Input',
    fieldName: '非负整数',
    componentProps: {
      placeholder: '校验非负整数（包括零）,但不能是01，001这种'
    },
    rules: {
      regExp: RegExpEnum.notInteger,
      msg: '请输入非负整数'
    },
    required: true
  },
  {
    fieldKey: 'name8',
    component: 'Input',
    fieldName: '正小数',
    componentProps: {
      placeholder: '校验正的小数（包含小数点，且小数部分至少有一位）'
    },
    rules: {
      regExp: RegExpEnum.positiveFloatingDigit1,
      msg: '请输入正小数'
    },
    required: true
  },
  {
    fieldKey: 'name9',
    component: 'Input',
    fieldName: '2位正小数',
    componentProps: {
      placeholder: '校验正的浮动数字（包含小数点，且小数部分最多2位）'
    },
    rules: {
      regExp: RegExpEnum.positiveFloatingDigit1,
      msg: '最多输入2位正小数'
    },
    required: true
  },
  {
    fieldKey: 'name10',
    component: 'Input',
    fieldName: '非负小数',
    componentProps: {
      placeholder: '校验非负小数（包括零，且小数部分至少有一位）'
    },
    rules: {
      regExp: RegExpEnum.positiveFloatingDigit3,
      msg: '请输入非负小数'
    },
    required: true
  },
  {
    fieldKey: 'name11',
    component: 'Input',
    fieldName: '2位非负小数',
    componentProps: {
      placeholder: '非负小数限制位数（包括零，且小数部分最多2位）'
    },
    rules: {
      regExp: RegExpEnum.positiveFloatingDigit4,
      msg: '最多输入2位非负小数'
    },
    required: true
  },
  {
    fieldKey: 'name12',
    component: 'Input',
    fieldName: '数字范围校验',
    componentProps: {
      placeholder: '数字在1到100之间，包含1和100'
    },
    rules: {
      regExp: RegExpEnum.rangeNumber,
      msg: '请输入数字在1到100之间，包含1和100'
    },
    required: true
  },
  {
    fieldKey: 'name13',
    component: 'Input',
    fieldName: '固定数字长度',
    componentProps: {
      placeholder: '限制输入的是一个6位的数字',
      maxlength: 6
    },
    rules: {
      regExp: RegExpEnum.length,
      msg: '请输入数字在1到100之间，包含1和100'
    },
    required: true
  },
  {
    fieldKey: 'name14',
    component: 'Input',
    fieldName: '手机号',
    componentProps: {
      placeholder: '请输入手机号',
      maxlength: 11
    },
    rules: {
      regExp: RegExpEnum.phone,
      msg: '请输入正确的手机号'
    },
    required: true
  },
  {
    fieldKey: 'name15',
    component: 'Input',
    fieldName: '邮箱',
    componentProps: {
      placeholder: '请输入邮箱'
    },
    rules: {
      regExp: RegExpEnum.email,
      msg: '请输入正确的邮箱'
    },
    required: true
  },
  {
    fieldKey: 'name16',
    component: 'Input',
    fieldName: '身份证号',
    componentProps: {
      placeholder: '请输入身份证号'
    },
    rules: {
      regExp: RegExpEnum.idCard,
      msg: '请输入正确的身份证号'
    },
    required: true
  },
  {
    fieldKey: 'name17',
    component: 'Input',
    fieldName: '中文',
    componentProps: {
      placeholder: '请输入中文'
    },
    rules: {
      regExp: RegExpEnum.fullName,
      msg: '请输入正确的中文'
    },
    required: true
  }
]