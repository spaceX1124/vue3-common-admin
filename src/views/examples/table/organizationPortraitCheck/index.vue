<template>
  <Page auto-content-height>
    <InitPage ref="InitPageRef" :initPageData="initPageData">
      <!-- 如果希望新增表单中，某个表单项要自定义内容，可直接使用具名插槽 -->
      <template #[name]="slotProps">
        <SelectCityModal v-bind="slotProps"/>
      </template>
      <template #storeCity="slotProps">
        <SelectCityModal v-bind="slotProps"/>
      </template>
      <template #arrivalTimeType="slotProps">
        <RadioPopover
          v-bind="slotProps"
          popoverShowRadioVal="2"
          :popover-show-list="businessList.hoursList"
          :schema="slotProps.schema"
          popoverTitle="自定义上线时段"
        />
      </template>
      <template #receptionCycle="slotProps">
        <RadioPopover
          v-bind="slotProps"
          popoverShowRadioVal="4"
          :popover-show-list="businessList.weekList"
          :schema="slotProps.schema"
          popoverTitle="自定义周期"
        />
      </template>
    </InitPage>
  </Page>
</template>
<script lang="tsx" setup>
import { reactive, ref } from 'vue'
import Page from '@/components/page/Page.vue'
import InitPage from '@/components/init-page/InitPage.vue'
import { getFieldList } from './index'
import SelectCityModal from '@/components/business/form/select-city-modal/SelectCityModal.vue'
import RadioPopover from '@/components/business/form/RadioPopover.vue'
import businessList from '@/enums/business.ts'
import type { IPage } from '@/types/business.ts'

// 机构画像审核
const agencyPortrait = {
  pageList: '/bus/cms/customer/profile/profile-list-audit',
  list: '/bus/cms/customer/profile/profile-list',
  detail: (id: number) => `/bus/cms/customer/profile/info/${id}`,
  update: '/bus/cms/customer/profile/save',
  status: (id: number) => `/bus/cms/customer/profile/status-change/${id}`
}

const InitPageRef = ref()
const initPageData = reactive<IPage>({
  request: { // 接口
    listUrl: {
      url: agencyPortrait.pageList,
      method: 'get'
    },
    detailUrl: {
      url: agencyPortrait.detail,
      method: 'get'
    }
  },
  getFieldList,
  buttonList: [ // 操作按钮
    {
      label: '详情',
      click: ({ row }: any) => {
        InitPageRef.value.showDetail(row.id)
      },
      show: (data: any) => {
        return true
      }
    },
    {
      label: '删除',
      click: (data: any) => {
        console.log(data, 'data11')
      }
    }
  ],
  operateWidth: 200,
  title: '画像'
})

let name = ref('house.belongPlace')

// @todo，处理表格按钮和详情获取及回显

// @todo，处理一下页面的样式和滚动条，分页
</script>