<template>
  <Page auto-content-height>
    <InitPage ref="InitPageRef" :initPageData="initPageData"/>
  </Page>
</template>
<script lang="tsx" setup>
import { reactive, ref } from 'vue'
import Page from '@/components/page/Page.vue'
import InitPage from '@/components/init-page/InitPage.vue'
import { getFieldList1 } from './index'

import type { IPage } from '@/types/business.ts'
import { table } from '@/libs/requestAddress.ts'

const InitPageRef = ref()
const initPageData = reactive<IPage>({
  request: { // 接口
    listUrl: {
      url: table.basicTableList,
      method: 'post'
    }
  },
  getFieldList: getFieldList1,
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

// @todo，处理表格按钮和详情获取及回显

// @todo，处理一下页面的样式和滚动条，分页
</script>