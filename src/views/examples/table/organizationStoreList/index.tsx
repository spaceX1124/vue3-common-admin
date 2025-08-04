import type { ISchema } from '@/adapter'
import businessList from '@/enums/business.ts'
import { Location } from '@element-plus/icons-vue'
import type { IGetFieldListParams } from '@/types/business.ts'

export function getFieldList ({ formMethods, tableMethods, searchMethods }: IGetFieldListParams):ISchema[] {
  return [
    {
      fieldKey: 'agencyName',
      fieldName: '机构名称',
      component: 'Input',
      useTable: true,
      useSearch: true
    },
    {
      fieldKey: 'agencyId',
      fieldName: '机构名称',
      component: 'ApiSelect',
      async: {
        url: '/bus/cms/agency/select-list',
        method: 'get',
        remote: true,
        remoteKey: 'name',
        label: 'name',
        value: 'id'
      },
      useForm: true,
      required: true,
      async beforeMount (value) {
        // 刷新公司请求参数
        formMethods?.updateFieldProperty('agencyId', 'async.data.id', value)
        const agencyIdField = formMethods?.getField?.('agencyId')
        const agencyIdRefresh = agencyIdField?.insideComp?.refresh
        if (agencyIdRefresh) await agencyIdRefresh()
      }
    },
    {
      fieldKey: 'agencySimpleName',
      fieldName: '机构简称',
      component: 'Input',
      useTable: true,
      useSearch: true
    },
    {
      fieldKey: 'agencyId',
      fieldName: '机构ID',
      component: 'Input',
      useTable: true,
      useSearch: true
    },
    {
      fieldKey: 'storeName',
      fieldName: '门店名称',
      component: 'Input',
      useTable: true,
      useSearch: true,
      useForm: true,
      required: true,
      componentProps: {
        maxlength: 10
      }
    },
    {
      fieldKey: 'storeCity',
      fieldName: '门店城市',
      component: 'Cascader',
      useSearch: true,
      componentProps: {
        options: businessList.cityList,
        props: {
          value: 'label'
        }
      }
    },
    {
      fieldKey: 'storeLogo',
      fieldName: '门店logo',
      component: 'Upload',
      useTable: true,
      useForm: true,
      required: true
    },

    {
      fieldKey: 'storeFrontImage',
      fieldName: '门店前台',
      component: 'Upload',
      useForm: true,
      required: true
    },
    {
      fieldKey: 'city',
      fieldName: '所在城市',
      component: 'Input',
      useTable: true
    },
    {
      fieldKey: 'locateAddress',
      fieldName: '定位地址',
      component: 'Input',
      useTable: true
    },
    {
      fieldKey: 'address',
      fieldName: '门店详细地址',
      component: 'Input',
      useTable: true
    },
    {
      fieldKey: 'storeFrontImage',
      fieldName: '门店前台照片',
      component: 'Upload',
      useTable: true
    },
    {
      fieldKey: 'storeContactPersonName',
      fieldName: '门店紧急联系人',
      component: 'Input',
      useTable: true
    },
    {
      fieldKey: 'storeContactPersonPhone',
      fieldName: '联系电话',
      component: 'Input',
      useTable: true
    },
    {
      fieldKey: 'province',
      fieldKeyArr: ['province', 'city', 'district'],
      fieldName: '门店所在城市',
      component: 'Cascader',
      componentProps: {
        options: businessList.areaList,
        props: {
          value: 'label'
        }
      },
      useForm: true,
      required: true
    },
    {
      fieldKey: 'locateAddress',
      fieldName: '定位地址',
      component: 'Input',
      useForm: true,
      componentProps: {
        placeholder: '点击定位'
      },
      renderComponentSlotContent: () => {
        return {
          suffix: <el-icon><Location/></el-icon>
        }
      },
      required: true
    },
    {
      fieldKey: 'address',
      fieldName: '详细地址',
      component: 'Input',
      useForm: true
    }
  ]
}
