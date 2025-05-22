import type { ISchema } from '@/adapter'
import type { FormMethods } from '@/packages/Forms'
import businessList from '@/enums/business.ts'

export function getFieldList (baseFormApi?: FormMethods):ISchema[] {
  return [
    {
      fieldKey: 'channelId',
      component: 'Input',
      fieldName: '渠道ID'
    },
    {
      fieldKey: 'channelName',
      fieldName: '渠道名称',
      component: 'Input',
      search: true
    },
    {
      fieldKey: 'type',
      component: 'Select',
      fieldName: '渠道类型',
      componentProps: {
        options: businessList.channelType
      },
      search: true,
      tableHidden: true
    },
    {
      fieldKey: 'channelNameType',
      component: 'Input',
      fieldName: '渠道类型'
    },
    {
      fieldKey: 'filterInfo',
      component: 'Input',
      fieldName: '撞库数/撞库成功数'
    },
    {
      fieldKey: 'visitInfo',
      component: 'Input',
      fieldName: '到访率/访问uv/登录用户数/访登率'
    },
    {
      fieldKey: 'leaveInformationInfo',
      component: 'Input',
      fieldName: '留资数/留资率'
    },
    {
      fieldKey: 'capitalConfirmInfo',
      component: 'Input',
      fieldName: '资质确定UV'
    },
    {
      fieldKey: 'customerInfo',
      component: 'Input',
      fieldName: '转客数/转客率'
    },
    {
      fieldKey: 'toStoreInfo',
      component: 'Input',
      fieldName: '到店客/转化率/渠道到店率'
    },
    {
      fieldKey: 'income',
      component: 'Input',
      fieldName: '渠道成本/渠道营收'
    },
    {
      fieldKey: 'roi',
      component: 'Input',
      fieldName: 'ROI'
    }
  ]
}

// 时段明细字段
export function getHourFieldList (baseFormApi?: FormMethods):ISchema[] {
  return [
    {
      fieldName: '时段',
      fieldKey: 'beginDate',
      fieldKeyArr: ['beginDate', 'endDate'],
      component: 'DatePicker',
      componentProps: {
        type: 'daterange',
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYYMMDD',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期'
        // style: {
        //   width: '350px'
        // }
      },
      search: true,
      tableHidden: true
    },
    {
      fieldKey: 'beginHour',
      fieldName: '时段',
      fieldKeyArr: ['beginHour', 'endHour'],
      component: 'Select',
      extraConfig: {
        minPlaceholder: '初始时段',
        maxPlaceholder: '截止时段'
      },
      search: true,
      tableHidden: true
    },
    {
      fieldKey: 'channelId',
      fieldName: '渠道ID',
      component: 'Input'
    },
    {
      fieldKey: 'channelName',
      fieldName: '渠道名称',
      component: 'Input'
    },
    {
      fieldKey: 'channelNameType',
      fieldName: '渠道类型',
      component: 'Input'
    },
    {
      fieldKey: 'filterInfo',
      fieldName: '撞库数/撞库成功数',
      component: 'Input'
    },
    {
      fieldKey: 'visitInfo',
      fieldName: '到访率/访问uv/登录用户数/访登率',
      component: 'Input'
    },
    {
      fieldKey: 'leaveInformationInfo',
      fieldName: '留资数/留资率',
      component: 'Input'
    },
    {
      fieldKey: 'capitalConfirmInfo',
      fieldName: '资质确定UV',
      component: 'Input'
    },
    {
      fieldKey: 'customerInfo',
      fieldName: '转客数/转客率',
      component: 'Input'
    },
    {
      fieldKey: 'toStoreInfo',
      fieldName: '到店客/转化率/渠道到店率',
      component: 'Input'
    }
  ]
}

// 资质明细字段
export function getCapitalFieldList (baseFormApi?: FormMethods):ISchema[] {
  return [
    {
      fieldName: '时段',
      fieldKey: 'beginDate',
      fieldKeyArr: ['beginDate', 'endDate'],
      component: 'DatePicker',
      componentProps: {
        type: 'daterange',
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYYMMDD',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期'
        // style: {
        //   width: '350px'
        // }
      },
      search: true,
      tableHidden: true
    },
    {
      fieldKey: 'day',
      fieldName: '数据日期',
      component: 'Input'
    },
    {
      fieldKey: 'channelId',
      fieldName: '渠道ID',
      component: 'Input'
    },
    {
      fieldKey: 'channelName',
      fieldName: '渠道名称',
      component: 'Input'
    },
    {
      fieldKey: 'channelNameType',
      fieldName: '渠道类型',
      component: 'Input'
    },
    {
      fieldKey: 'carInfo',
      fieldName: '有车（校验数丨校验有车）',
      component: 'Input'
    },
    {
      fieldKey: 'gjjInfo',
      fieldName: '有公积金（校验数丨校验有公积金）',
      component: 'Input'
    },
    {
      fieldKey: 'socialInsuranceInfo',
      fieldName: '有社保（校验数丨校验有社保）',
      component: 'Input'
    },
    {
      fieldKey: 'houseInfo',
      fieldName: '有房（校验数丨校验有房）',
      component: 'Input'
    }
  ]
}

// 城市明细
export function getCityFieldList (baseFormApi?: FormMethods):ISchema[]{
  return [
    {
      fieldName: '时段',
      fieldKey: 'beginDate',
      fieldKeyArr: ['beginDate', 'endDate'],
      component: 'DatePicker',
      componentProps: {
        type: 'daterange',
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYYMMDD',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期'
        // style: {
        //   width: '350px'
        // }
      },
      search: true,
      tableHidden: true
    },
    {
      fieldKey: 'city',
      fieldName: '城市名称',
      component: 'Input'
    },
    {
      fieldKey: 'leaveInformationInfo',
      fieldName: '留资用户',
      component: 'Input',
      sortConfig: {
        sortKey: 'sortIndex',
        sortValue: 1,
        sortTypeKey: 'sortType'
      }
    },
    {
      fieldKey: 'customerInfo',
      fieldName: '转客数',
      component: 'Input',
      sortConfig: {
        sortKey: 'sortIndex',
        sortValue: 2,
        sortTypeKey: 'sortType'
      }
    },
    {
      fieldKey: 'toStoreInfo',
      fieldName: '到店客',
      component: 'Input',
      sortConfig: {
        sortKey: 'sortIndex',
        sortValue: 3,
        sortTypeKey: 'sortType'
      }
    }
  ]
}
