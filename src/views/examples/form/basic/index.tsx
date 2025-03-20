import RegExpEnum from '@/utils/regExp'
import { type ISchema } from '@/adapter'
import { isArray, isNullOrUndefOrEmpty } from '@/utils/is'
//
// const jsonList = [
//   {
//     key: 'name',
//     fieldName: '姓名', // 字段名
//     keyArr: ['firstKey', 'lastKey'], // 遇到过，搜索的时候，一个组件，后端要接受2个参数的情况，如日期区间
//     component: 'Input', // 要呈现什么组件
//     tableListHidden: true, // 该字段不在表格中出现
//     formListHidden: true, // 该字段不在表单中出现
//     rules: () => [], // 自定义表单校验规则
//     search: true, // 该字段在搜索框中显示
//     async: {
//       // 需要异步数据
//       url: '', // 接口地址
//       method: 'get', // 请求方法
//       label: 'label', // list对应的label取对应的字段
//       value: 'value' // list对应的value取对应的字段
//     },
//     componentsProps: {
//       // 用到UI组件库api文档中的属性和方法都写到这
//       options: [
//         // list使用本地数据，要求是label，value格式的，也可以延伸，如disabled，后面在看
//         {
//           label: '选项1',
//           value: '1'
//         },
//         {
//           label: '选项2',
//           value: '2'
//         }
//       ]
//     }
//   }
// ]

// 要特殊处理的组件，获取需要异步获取数据的组件，统统使用自定义组件
// 重新包装了CheckboxGroup、RadioGroup、Select，可以通过options属性传入选项属性数组以自动生成选项

export const inputList: ISchema[] = [
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

export const selectList: ISchema[] = [
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
    fieldKey: 'hobby3',
    component: 'ApiSelect',
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
      focus: (e: any) => {
        console.log(e, 'focus')
      }
    }
  },
  {
    fieldKey: 'hobby4',
    component: 'ApiSelect',
    fieldName: '异步搜索下拉',
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
  }
]

export const radioList: ISchema[] = [
  {
    fieldKey: 'sex1',
    fieldName: '性别1',
    component: 'RadioGroup',
    required: true,
    componentProps: {
      options: [
        {
          label: '男',
          value: 1
        },
        {
          label: '女',
          value: 2
        }
      ]
    }
  },
  {
    fieldKey: 'sex2',
    fieldName: '性别2',
    component: 'RadioGroup',
    required: true,
    componentProps: {
      isButton: true,
      options: [
        {
          label: '男',
          value: 1
        },
        {
          label: '女',
          value: 2
        }
      ]
    }
  },
  {
    fieldKey: 'hobby',
    fieldName: '爱好',
    component: 'RadioGroup',
    required: true,
    componentProps: {
      options: [
        {
          label: '篮球',
          value: 1
        },
        {
          label: '足球',
          value: 2
        },
        {
          label: '泡泡球',
          value: 3
        },
        {
          label: '乒乓球',
          value: 4
        },
        {
          label: '棒球',
          value: 5
        }
      ]
    }
  },
  {
    fieldKey: 'key4',
    fieldName: '异步爱好',
    component: 'ApiRadioGroup',
    required: true,
    async: {
      // 需要异步数据
      url: '/api/hobbyList', // 接口地址
      method: 'post', // 请求方法
      label: 'title', // list对应的label取对应的字段
      value: 'id' // list对应的value取对应的字段
    }
  },
  {
    fieldKey: 'key5',
    fieldName: '异步爱好',
    component: 'ApiRadioGroup',
    required: true,
    componentProps: {
      isButton: true
    },
    async: {
      // 需要异步数据
      url: '/api/hobbyList', // 接口地址
      method: 'post', // 请求方法
      label: 'title', // list对应的label取对应的字段
      value: 'id' // list对应的value取对应的字段
    }
  }
]

export const checkboxList:ISchema[] = [
  {
    fieldKey: 'key1',
    fieldName: '爱好',
    component: 'CheckboxGroup',
    required: true,
    componentProps: {
      options: [
        {
          label: '男',
          value: 1
        },
        {
          label: '女',
          value: 2
        }
      ]
    }
  },
  {
    fieldKey: 'key2',
    fieldName: '异步爱好',
    component: 'ApiCheckboxGroup',
    required: true,
    async: {
      // 需要异步数据
      url: '/api/hobbyList', // 接口地址
      method: 'post', // 请求方法
      label: 'title', // list对应的label取对应的字段
      value: 'id' // list对应的value取对应的字段
    }
  },
  {
    fieldKey: 'key3',
    fieldName: '爱好3',
    component: 'CheckboxGroupAll',
    required: true,
    componentProps: {
      options: [
        {
          label: '男',
          value: 1
        },
        {
          label: '女',
          value: 2
        }
      ]
    }
  },
  {
    fieldKey: 'key4',
    fieldName: '异步爱好4',
    component: 'CheckboxGroupAll',
    required: true,
    async: {
      // 需要异步数据
      url: '/api/hobbyList', // 接口地址
      method: 'post', // 请求方法
      label: 'title', // list对应的label取对应的字段
      value: 'id' // list对应的value取对应的字段
    }
  }
]
export const intervalInputList:ISchema[] = [
  {
    fieldKey: 'key1',
    fieldKeyArr: ['first1', 'last1'],
    fieldName: '贷款金额(只校验必填)',
    component: 'IntervalInput',
    required: true
  },
  {
    fieldKey: 'key2',
    fieldKeyArr: ['first2', 'last2'],
    fieldName: '贷款金额(整数且最小值不能大于最大值)',
    component: 'IntervalInput',
    required: true,
    rules: (value) => {
      // 如果需要校验其他格式，请在rules中自己添加校验规则
      if (isArray(value)) {
        if (!RegExpEnum.integer.test(value[0]) || !RegExpEnum.integer.test(value[1])) {
          return '请输入整数'
        } else if(Number(value[1]) < Number(value[0])) {
          return '最大值不能小于最小值'
        } else {
          return true
        }
      } else {
        return '数据格式不正确'
      }
    }
  }
]