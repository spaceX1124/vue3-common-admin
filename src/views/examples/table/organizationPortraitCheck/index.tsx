import type { ISchema } from '@/adapter'
import type { FormMethods } from '@/packages/Forms'
import { isArray, isEmpty, isNullOrUndefOrEmpty } from '@/utils/is.ts'
import businessList from '@/enums/business.ts'
import RegExpEnum from '@/utils/regExp'
import { moneyTransform } from '@/utils/unit.ts'
import { h } from 'vue'
import type { IGetFieldListParams } from '@/types/business.ts'

/**
 * 客户类型控制其他字段的显隐
 * */
function visibleCustomerType (formMethods?: FormMethods, value?: any) {
  // 个人
  formMethods?.updateFieldProperty('customerPropertyCategory', 'formHidden', value !== '1') // 显示客户资产
  // 企业
  formMethods?.updateFieldProperty('company.establishmentYears', 'formHidden', value !== '2')// 显示成立年限
  formMethods?.updateFieldProperty('company.annualTurnover', 'formHidden', value !== '2')// 显示年营业额
  formMethods?.updateFieldProperty('company.annualDenomination', 'formHidden', value !== '2')// 显示年开票额
  formMethods?.updateFieldProperty('company.taxBrackets', 'formHidden', value !== '2')// 显示纳税等级
}
/**
 * 客户资产控制其他字段的显隐
 * */

function visibleCustomerPropertyCategory (formMethods?: FormMethods, value?: any) {
  // 房
  formMethods?.updateFieldProperty('house.type', 'formHidden', value !== '1') // 展示房产类型字段
  formMethods?.updateFieldProperty('house.belongPlace', 'formHidden', value !== '1') // 展示房产归属地字段

  // 车
  formMethods?.updateFieldProperty('car.operationType', 'formHidden', value !== '2') // 展示营运类型字段
  formMethods?.updateFieldProperty('car.energyType', 'formHidden', value !== '2') // 展示能源类型字段
  formMethods?.updateFieldProperty('car.carValuation', 'formHidden', value !== '2') // 展示车辆估值字段

  // 公积金
  formMethods?.updateFieldProperty('gjj.paymentRatio', 'formHidden', value !== '3') // 展示缴纳比例字段
  formMethods?.updateFieldProperty('gjj.paymentYears', 'formHidden', value !== '3') // 展示缴纳年限字段
  formMethods?.updateFieldProperty('gjj.paymentBase', 'formHidden', value !== '3') // 展示缴纳基数字段

  // 社保
  formMethods?.updateFieldProperty('socialInsurance.paymentYears', 'formHidden', value !== '5') // 展示缴纳年限字段
  formMethods?.updateFieldProperty('socialInsurance.paymentBase', 'formHidden', value !== '5') // 展示缴纳基数字段
}

/**
 * 处理门店地址下面的详情地址展示
 * */
function locateAddressFn (formMethods?: FormMethods, value?: string[]) {
  const storeIdsField = formMethods?.getField('storeIds')
  if (storeIdsField) {
    // 拿到字段最新的下拉数据列表
    const options: Record<string, any>[] = storeIdsField.componentProps?.options || []
    const arr: Record<string, any>[] = []
    options?.forEach(item => {
      if (value?.includes(item.value)) {
        arr.push(item)
      }
    })
    // 设置表单项下面的插槽内容
    formMethods?.updateFieldProperty(
      'storeIds',
      'slotContent.bottom',
      h('ul', arr.map(item => h('li', { style: { lineHeight: '28px' } }, item.locateAddress)))
    )
  }

}
export function getFieldList ({ formMethods, tableMethods, searchMethods }: IGetFieldListParams):ISchema[] {
  return [
    {
      fieldKey: 'id',
      fieldName: '画像ID',
      component: 'Input',
      useTable: true
    },
    {
      fieldKey: 'agencyName',
      fieldName: '机构名称',
      component: 'Input',
      useSearch: true
    },
    {
      fieldKey: 'agencyId',
      fieldName: '机构ID',
      component: 'Input',
      useSearch: true
    },
    {
      fieldKey: 'agencySimpleName',
      fieldName: '机构简称',
      component: 'Input',
      useSearch: true
    },
    {
      fieldKey: 'auditStatus',
      fieldName: '审批状态',
      component: 'Select',
      componentProps: {
        options: businessList.checkType_
      },
      useSearch: true
    },
    {
      fieldKey: 'name',
      fieldName: '画像名称',
      component: 'Input',
      useSearch: true,
      useTable: true
    },
    {
      fieldKey: 'agencyName',
      fieldName: '所属机构',
      component: 'Input',
      useTable: true
    },
    {
      fieldKey: 'agencyId',
      fieldName: '机构ID',
      component: 'Input',
      useTable: true
    },
    {
      fieldKey: 'agencySimpleName',
      fieldName: '机构简称',
      component: 'Input',
      useTable: true
    },
    {
      fieldKey: 'storeCity',
      fieldName: '城市',
      component: 'Input',
      useTable: true
    },
    {
      fieldKey: 'createTime',
      fieldName: '创建时间',
      component: 'Input',
      useTable: true
    },
    {
      fieldKey: 'auditTime',
      fieldName: '审批时间',
      component: 'Input',
      useTable: true
    },
    {
      fieldKey: 'auditStatus',
      fieldName: '审批状态',
      component: 'Select',
      componentProps: {
        options: businessList.checkType_
      },
      isEcho: true,
      useTable: true
    },
    {
      fieldKey: 'remark',
      fieldName: '审批备注',
      component: 'Input',
      useTable: true
    },
    {
      fieldKey: 'auditOperator',
      fieldName: '审批人',
      component: 'Input',
      useTable: true
    },
    {
      fieldKey: 'account',
      fieldName: '账号手机号',
      component: 'Input',
      useSearch: true
    },
    {
      fieldKey: 'agencyId',
      fieldName: '公司',
      component: 'ApiSelect',
      async: {
        url: '/bus/cms/agency/select-list',
        method: 'get',
        label: 'name',
        value: 'id',
        remote: true,
        remoteKey: 'name'
      },
      required: true,
      useForm: true,
      componentEvent: {
        onChange: async (value: string) => {
          // 刷新门店地址参数
          formMethods?.updateFieldProperty('storeIds', 'async.data.agencyId', value)
          const storeIdsField = formMethods?.getField?.('storeIds')
          const storeIdsRefresh = storeIdsField?.insideComp?.refresh
          if (storeIdsRefresh) await storeIdsRefresh()// 刷新门店地址下拉数据
        }
      },
      async beforeMount (value) {
        console.log(value, 'value444')
        // 刷新公司请求参数
        formMethods?.updateFieldProperty('agencyId', 'async.data.id', value)
        const agencyIdField = formMethods?.getField?.('agencyId')
        console.log(agencyIdField, 'agencyIdField11')
        const agencyIdRefresh = agencyIdField?.insideComp?.refresh
        if (agencyIdRefresh) await agencyIdRefresh()// 刷新公司下拉数据
        // 需要清空请求参数，因为后续是通过remote搜索，不能带id了
        // formMethods?.updateFieldProperty('agencyId', 'async.data', {})
      }
    },
    {
      fieldKey: 'customerType',
      fieldName: '客户类型',
      component: 'RadioGroup',
      componentProps: {
        options: businessList.customerType,
        isButton: true
      },
      componentEvent: {
        onChange: (value: any) => {
          console.log('只一', value)
          visibleCustomerType(formMethods, value)
        }
      },
      required: true,
      useForm: true,
      beforeMount (value) {
        console.log(value, 'value11')
        visibleCustomerType(formMethods, value)
      }
    },
    {
      fieldKey: 'customerPropertyCategory',
      fieldName: '客户资产',
      component: 'RadioGroup',
      componentProps: {
        options: businessList.propertyType,
        isButton: true
      },
      componentEvent: {
        onChange: (value: any) => {
          visibleCustomerPropertyCategory(formMethods, value)
        }
      },
      required: true,
      useForm: true,
      formHidden: true,
      beforeMount: (value: any) => {
        visibleCustomerPropertyCategory(formMethods, value)
      }
    },
    {
      fieldKey: 'house.type',
      fieldName: '房产类型',
      component: 'RadioGroup',
      componentProps: {
        options: businessList.houseType,
        isButton: true
      },
      required: true,
      useForm: true,
      formHidden: true
    },
    {
      fieldKey: 'house.belongPlace',
      fieldName: '房产归属地',
      component: 'Input',
      useForm: true,
      formHidden: true
    },
    {
      fieldKey: 'car.operationType',
      fieldName: '营运类型',
      component: 'RadioGroup',
      componentProps: {
        options: businessList.carOperateType,
        isButton: true
      },
      required: true,
      useForm: true,
      formHidden: true
    },
    {
      fieldKey: 'car.energyType',
      fieldName: '能源类型',
      component: 'RadioGroup',
      componentProps: {
        options: businessList.carEnergyType,
        isButton: true
      },
      required: true,
      useForm: true,
      formHidden: true
    },
    {
      fieldKey: 'car.carValuation',
      fieldName: '车辆估值',
      component: 'RadioGroup',
      componentProps: {
        options: businessList.vehicleValuation,
        isButton: true
      },
      required: true,
      useForm: true,
      formHidden: true
    },
    {
      fieldKey: 'gjj.paymentRatio',
      fieldName: '缴纳比例',
      component: 'Select',
      componentProps: {
        options: businessList.gjjRatioType
      },
      useForm: true,
      formHidden: true
    },
    {
      fieldKey: 'gjj.paymentYears',
      fieldName: '缴纳年限',
      component: 'Select',
      componentProps: {
        options: businessList.gjjAgeType
      },
      useForm: true,
      formHidden: true
    },
    {
      fieldKey: 'gjj.paymentBase',
      fieldName: '缴纳基数',
      component: 'Input',
      rules: {
        regExp: RegExpEnum.zero_9999point99,
        msg: '支持小数点后两位，0<x<9999.99'
      },
      valueFormatter: {
        to: (value) => moneyTransform(value, 'yuan', 'fen'),
        from: (value) => moneyTransform(value, 'fen', 'yuan')
      },
      useForm: true,
      formHidden: true
    },
    {
      fieldKey: 'socialInsurance.paymentYears',
      fieldName: '缴纳年限',
      component: 'Select',
      componentProps: {
        options: businessList.gjjAgeType
      },
      useForm: true,
      formHidden: true
    },
    {
      fieldKey: 'socialInsurance.paymentBase',
      fieldName: '缴纳基数',
      component: 'Input',
      rules: {
        regExp: RegExpEnum.zero_9999point99,
        msg: '支持小数点后两位，0<x<9999.99'
      },
      valueFormatter: {
        to: (value) => moneyTransform(value, 'yuan', 'fen'),
        from: (value) => moneyTransform(value, 'fen', 'yuan')
      },
      useForm: true,
      formHidden: true
    },
    {
      fieldKey: 'company.establishmentYears',
      fieldName: '成立年限',
      component: 'RadioGroup',
      componentProps: {
        options: businessList.yearType,
        isButton: true
      },
      useForm: true,
      formHidden: true
    },
    {
      fieldKey: 'company.annualTurnover',
      fieldName: '年营业额',
      component: 'Input',
      rules: {
        regExp: RegExpEnum.zero_9999999point99,
        msg: '支持小数点后两位，0<x<9999999.99'
      },
      valueFormatter: {
        to: (value) => moneyTransform(value, 'wan', 'fen'),
        from: (value) => moneyTransform(value, 'fen', 'wan')
      },
      renderComponentSlotContent: () => {
        return {
          suffix: '万元'
        }
      },
      useForm: true,
      formHidden: true
    },
    {
      fieldKey: 'company.annualDenomination',
      fieldName: '年开票额',
      component: 'Input',
      rules: {
        regExp: RegExpEnum.zero_9999999point99,
        msg: '支持小数点后两位，0<x<9999999.99'
      },
      valueFormatter: {
        to: (value) => moneyTransform(value, 'wan', 'fen'),
        from: (value) => moneyTransform(value, 'fen', 'wan')
      },
      renderComponentSlotContent: () => {
        return {
          suffix: '万元'
        }
      },
      useForm: true,
      formHidden: true
    },
    {
      fieldKey: 'company.taxBrackets',
      fieldName: '纳税等级',
      component: 'RadioGroup',
      componentProps: {
        options: businessList.taxGradeList,
        isButton: true
      },
      useForm: true,
      formHidden: true
    },
    {
      fieldKey: 'invitationType',
      fieldName: '邀约类型',
      component: 'RadioGroup',
      componentProps: {
        options: businessList.invitationType,
        isButton: true
      },
      required: true,
      defaultValue: 1,
      useForm: true
    },
    {
      fieldKey: 'storeCity',
      fieldName: '门店城市',
      component: 'Input',
      componentEvent: {
        // 此字段是通过slot渲染，事件定义根据slot所用的组件emit的事件为准
        async emitData (value: string) {
          formMethods?.updateFieldProperty('storeIds', 'async.data.storeCity', value) // 更新门店地址请求参数值
          const storeIdsField = formMethods?.getField?.('storeIds')
          const storeIdsRefresh = storeIdsField?.insideComp?.refresh
          if (storeIdsRefresh) await storeIdsRefresh()// 刷新门店地址下拉数据
        }
      },
      useForm: true
    },
    {
      fieldKey: 'storeIds',
      fieldName: '门店地址',
      component: 'ApiSelect',
      componentProps: {
        multiple: true
      },
      async: {
        url: '/bus/cms/agency/store/select-list',
        method: 'post',
        data: {
          storeCity: '',
          agencyId: '',
          id: ''
        },
        label: 'storeName',
        value: 'id',
        immediate: false
      },
      componentEvent: {
        change (value: string[]) {
          locateAddressFn(formMethods, value) // 回显门店详细地址
        }
      },
      async beforeMount (value) {
        // 刷新门店地址请求参数
        const agencyId = formMethods?.getFieldValue?.('agencyId')
        formMethods?.updateFieldProperty('storeIds', 'async.data', { id: value, agencyId })

        const storeIdsField = formMethods?.getField?.('storeIds')
        const storeIdsRefresh = storeIdsField?.insideComp?.refresh
        if (storeIdsRefresh) await storeIdsRefresh()// 刷新门店地址下拉数据
        locateAddressFn(formMethods, value) // 回显门店详细地址
      },
      required: true,
      useForm: true
      // slotContent: {
      //   bottom: () => {
      //     return h('p', '')
      //   }
      // }
    },
    {
      fieldKey: 'ageMin',
      fieldKeyArr: ['ageMin', 'ageMax'],
      fieldName: '年龄要求',
      component: 'IntervalInput',
      extraConfig: {
        minPlaceholder: '最小周岁',
        maxPlaceholder: '最大周岁'
      },
      required: true,
      useForm: true,
      rules (value) {
        if (isArray(value)) {
          // 只输如25，代表25-最大（75）
          if (isNullOrUndefOrEmpty(value[0])) {
            return '请输入最小周岁'
          } else if (isNullOrUndefOrEmpty(value[1])) {
            return '请输入最大周岁'
          } else if (!RegExpEnum.positiveInteger.test(value[0]) || !RegExpEnum.positiveInteger.test(value[1])) {
            return '请输入正整数'
          } else if (Number(value[0]) < 22) {
            return '最小周岁不能低于22岁'
          } else if (Number(value[1]) > 75) {
            return '最大周岁不能大于75岁'
          } else if (Number(value[1]) < Number(value[0])) {
            return '最大周岁不能小于最小周岁'
          } else {
            return true
          }
        } else {
          return true
        }
      }
    },
    {
      fieldKey: 'customerDemand',
      fieldName: '客户需求',
      component: 'RadioGroup',
      componentProps: {
        options: businessList.customerXQType,
        isButton: true
      },
      useForm: true
    },
    {
      fieldKey: 'dailyAverageQuantity',
      fieldName: '日均客量',
      component: 'Input',
      componentProps: {
        placeholder: '请输入每日想吸引客户的数量'
      },
      rules: {
        regExp: RegExpEnum.zero_9999,
        msg: '仅支持数字输入，0<x<9999'
      },
      useForm: true
    },
    {
      fieldKey: 'arrivalTimeType',
      fieldName: '到店时段',
      fieldKeyArr: ['arrivalTimeType', 'arrivalTime'],
      component: 'RadioGroup',
      required: true,
      useForm: true,
      componentProps: {
        options: businessList.arrivalTimeType,
        isButton: true
      },
      rules (value) {
        // 这儿还要校验复选框的值，还有，复选框的值怎么设置到表单数据中
        if(isArray(value)) {
          if (isNullOrUndefOrEmpty(value[0])) {
            return '请选择到店时段'
          } else if(value[0] === '2' && (isNullOrUndefOrEmpty(value[1]) || isEmpty(value[1]))) {
            return '请选择自定义上线时段'
          } else {
            return true
          }
        } else {
          return true
        }
      }
    },
    {
      fieldKey: 'receptionCycle',
      component: 'RadioGroup',
      fieldName: '接待周期',
      fieldKeyArr: ['receptionCycle', 'receptionCycleValue'],
      required: true,
      useForm: true,
      componentProps: {
        options: businessList.cycleType,
        isButton: true
      },
      rules (value) {
        // 这儿还要校验复选框的值，还有，复选框的值怎么设置到表单数据中
        if(isArray(value)) {
          if (isNullOrUndefOrEmpty(value[0])) {
            return '请选择接待周期'
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
      fieldKey: 'consumeCurrencyAmount',
      fieldName: '设置糖豆',
      component: 'Input',
      rules: {
        regExp: RegExpEnum.oneHundred_9998Number,
        msg: '请输入100<=x<9999的整数'
      },
      required: true,
      useForm: true,
      valueFormatter: {
        to: (value) => moneyTransform(value, 'yuan', 'fen'),
        from: (value) => moneyTransform(value, 'fen', 'yuan')
      }
    },
    {
      fieldKey: 'name',
      fieldName: '画像名称',
      component: 'Input',
      required: true,
      useForm: true,
      componentProps: {
        placeholder: '请为本次画像命名',
        maxLength: 10
      },
      rules (value) {
        if (value === 'null') {
          return '不能输入null'
        } else {
          return true
        }
      }
    }
  ]
}
