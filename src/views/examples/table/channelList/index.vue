<template>
  <Page auto-content-height>
    <InitPage ref="InitPageRef" :initPageData="initPageData">
      <template #paymentType="slotProps">
        <div>
          <RadioInput v-bind="slotProps"/>
        </div>
      </template>
      <template #onlinePeriod="slotProps">
        <RadioPopover
          v-bind="slotProps"
          popoverShowRadioVal="3"
          :popover-show-list="businessList.hoursList"
          :schema="slotProps.schema"
          popoverTitle="自定义上线时段"
        />
      </template>
      <template #onlineCycle="slotProps">
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
import RadioInput from './components/RadioInput.vue'

import type { IPage } from '@/types/business.ts'
import businessList from '@/enums/business.ts'
import RadioPopover from '@/components/business/form/RadioPopover.vue'

// 机构画像审核
const channelList = {
  pageList: '/bus/cms/channel/list',
  detail: (id: number) => `/bus/cms/channel/info/${id}`,
  update: '/bus/cms/channel/save',
  selectList: '/bus/cms/channel/select-list',
  staticList: '/cms/count/channel/page',
  staticHourList: '/cms/count/channel/hourPage',
  channelCapitalList: '/cms/count/channel/capital',
  channelCityList: '/cms/count/channel/city'
}

const InitPageRef = ref()
const initPageData = reactive<IPage>({
  request: { // 接口
    listUrl: {
      url: channelList.pageList,
      method: 'get'
    },
    detailUrl: {
      url: channelList.detail,
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