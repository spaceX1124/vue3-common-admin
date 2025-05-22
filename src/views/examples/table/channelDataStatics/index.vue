<template>
  <Page auto-content-height>
    <InitPage
      ref="InitPageRef"
      :initPageData="initPageData"/>
  </Page>
  <PopInitPage
    v-if="popShow"
    v-model="popShow"
    :popTitle="popTitle"
    :initPageData="popInitPageData"
  >
    <template #beginHour="slotProps">
      <HourSelectRange v-bind="slotProps"/>
    </template>
  </PopInitPage>
</template>
<script lang="tsx" setup>
import { reactive, ref } from 'vue'
import Page from '@/components/page/Page.vue'
import InitPage from '@/components/init-page/InitPage.vue'
import PopInitPage from '@/components/init-page/PopInitPage.vue'
import HourSelectRange from '@/components/business/form/HourSelectRange.vue'
import { getCapitalFieldList, getCityFieldList, getFieldList, getHourFieldList } from './index'

import type { IPage } from '@/types/business.ts'

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
const popShow = ref(false)
const popTitle = ref('')
const initPageData = reactive<IPage>({
  request: { // 接口
    listUrl: {
      url: channelList.staticList,
      method: 'get'
    }
  },
  getFieldList,
  buttonList: [ // 操作按钮
    {
      label: '时段明细',
      click: ({ row }: any) => {
        const { channelId } = row
        popInitPageData.request.listUrl = {
          url: channelList.staticHourList,
          method: 'get',
          data: {
            channelId
          }
        }
        popInitPageData.getFieldList = getHourFieldList
        popShow.value = true
        popTitle.value = '时段明细'
      }
    },
    {
      label: '资质明细',
      click: ({ row }: any) => {
        const { channelId } = row
        popInitPageData.request.listUrl = {
          url: channelList.channelCapitalList,
          method: 'get',
          data: {
            channelId
          }
        }
        popInitPageData.getFieldList = getCapitalFieldList
        popShow.value = true
        popTitle.value = '资质明细'
      }
    },
    {
      label: '城市明细',
      click: ({ row }: any) => {
        const { channelId } = row
        popInitPageData.request.listUrl = {
          url: channelList.channelCityList,
          method: 'get',
          data: {
            channelId
          }
        }
        popInitPageData.getFieldList = getCityFieldList
        popShow.value = true
        popTitle.value = '城市明细'
      }
    }
  ],
  operateWidth: 300,
  hiddenAdd: true
})

const popInitPageData = reactive<IPage>({
  request: { // 接口
    listUrl: {
      url: channelList.staticHourList,
      method: 'get'
    }
  },
  getFieldList: getHourFieldList,
  hiddenAdd: true
})
</script>