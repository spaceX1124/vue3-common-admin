import type { ISchema } from '@/adapter'
import type { FormMethods } from '@/packages/Forms'
import businessList from '@/enums/business.ts'
import type { IGetFieldListParams } from '@/types/business.ts'

export function getFieldList ({ formMethods, tableMethods, searchMethods }: IGetFieldListParams):ISchema[] {
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
      useSearch: true
    },
    {
      fieldKey: 'channelId',
      component: 'Input',
      fieldName: '渠道ID',
      useTable: true
    },
    {
      fieldKey: 'channelName',
      fieldName: '渠道名称',
      component: 'Input',
      useSearch: true,
      useTable: true
    },
    {
      fieldKey: 'type',
      component: 'Select',
      fieldName: '渠道类型',
      componentProps: {
        options: businessList.channelType
      },
      useSearch: true
    },
    {
      fieldKey: 'channelNameType',
      component: 'Input',
      fieldName: '渠道类型',
      useTable: true
    },
    {
      fieldKey: 'filterInfo',
      component: 'Input',
      fieldName: '撞库数/撞库成功数',
      useTable: true
    },
    {
      fieldKey: 'visitInfo',
      component: 'Input',
      fieldName: '到访率/访问uv/登录用户数/访登率',
      useTable: true
    },
    {
      fieldKey: 'leaveInformationInfo',
      component: 'Input',
      fieldName: '留资数/留资率',
      useTable: true
    },
    {
      fieldKey: 'capitalConfirmInfo',
      component: 'Input',
      fieldName: '资质确定UV',
      useTable: true
    },
    {
      fieldKey: 'customerInfo',
      component: 'Input',
      fieldName: '转客数/转客率',
      useTable: true
    },
    {
      fieldKey: 'toStoreInfo',
      component: 'Input',
      fieldName: '到店客/转化率/渠道到店率',
      useTable: true
    },
    {
      fieldKey: 'income',
      component: 'Input',
      fieldName: '渠道成本/渠道营收',
      useTable: true
    },
    {
      fieldKey: 'roi',
      component: 'Input',
      fieldName: 'ROI',
      useTable: true
    }
  ]
}

// 时段明细字段
export function getHourFieldList ({ formMethods, tableMethods, searchMethods }: IGetFieldListParams):ISchema[] {
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
      useSearch: true
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
      useSearch: true
    },
    {
      fieldKey: 'channelId',
      fieldName: '渠道ID',
      component: 'Input',
      useTable: true
    },
    {
      fieldKey: 'channelName',
      fieldName: '渠道名称',
      component: 'Input',
      useTable: true
    },
    {
      fieldKey: 'channelNameType',
      fieldName: '渠道类型',
      component: 'Input',
      useTable: true
    },
    {
      fieldKey: 'filterInfo',
      fieldName: '撞库数/撞库成功数',
      component: 'Input',
      useTable: true
    },
    {
      fieldKey: 'visitInfo',
      fieldName: '到访率/访问uv/登录用户数/访登率',
      component: 'Input',
      useTable: true
    },
    {
      fieldKey: 'leaveInformationInfo',
      fieldName: '留资数/留资率',
      component: 'Input',
      useTable: true
    },
    {
      fieldKey: 'capitalConfirmInfo',
      fieldName: '资质确定UV',
      component: 'Input',
      useTable: true
    },
    {
      fieldKey: 'customerInfo',
      fieldName: '转客数/转客率',
      component: 'Input',
      useTable: true
    },
    {
      fieldKey: 'toStoreInfo',
      fieldName: '到店客/转化率/渠道到店率',
      component: 'Input',
      useTable: true
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
      useSearch: true
    },
    {
      fieldKey: 'day',
      fieldName: '数据日期',
      component: 'Input',
      useTable: true
    },
    {
      fieldKey: 'channelId',
      fieldName: '渠道ID',
      component: 'Input',
      useTable: true
    },
    {
      fieldKey: 'channelName',
      fieldName: '渠道名称',
      component: 'Input',
      useTable: true
    },
    {
      fieldKey: 'channelNameType',
      fieldName: '渠道类型',
      component: 'Input',
      useTable: true
    },
    {
      fieldKey: 'carInfo',
      fieldName: '有车（校验数丨校验有车）',
      component: 'Input',
      useTable: true
    },
    {
      fieldKey: 'gjjInfo',
      fieldName: '有公积金（校验数丨校验有公积金）',
      component: 'Input',
      useTable: true
    },
    {
      fieldKey: 'socialInsuranceInfo',
      fieldName: '有社保（校验数丨校验有社保）',
      component: 'Input',
      useTable: true
    },
    {
      fieldKey: 'houseInfo',
      fieldName: '有房（校验数丨校验有房）',
      component: 'Input',
      useTable: true
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
      useSearch: true
    },
    {
      fieldKey: 'city',
      fieldName: '城市名称',
      component: 'Input',
      useTable: true
    },
    {
      fieldKey: 'leaveInformationInfo',
      fieldName: '留资用户',
      component: 'Input',
      sortConfig: {
        sortKey: 'sortIndex',
        sortValue: 1,
        sortTypeKey: 'sortType'
      },
      useTable: true
    },
    {
      fieldKey: 'customerInfo',
      fieldName: '转客数',
      component: 'Input',
      sortConfig: {
        sortKey: 'sortIndex',
        sortValue: 2,
        sortTypeKey: 'sortType'
      },
      useTable: true
    },
    {
      fieldKey: 'toStoreInfo',
      fieldName: '到店客',
      component: 'Input',
      sortConfig: {
        sortKey: 'sortIndex',
        sortValue: 3,
        sortTypeKey: 'sortType'
      },
      useTable: true
    }
  ]
}
