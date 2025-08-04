<template>
  <Page auto-content-height>
    <InitPage
      ref="InitPageRef"
      :initPageData="initPageData"
    >
      <template #address="slotProps">
        <MultipleInput v-bind="slotProps"/>
      </template>
    </InitPage>
  </Page>
</template>
<script lang="tsx" setup>
import { nextTick, reactive, ref } from 'vue'
import Page from '@/components/page/Page.vue'
import InitPage from '@/components/init-page/InitPage.vue'
import { getFieldList } from './index'

import type { IPage } from '@/types/business.ts'
import MultipleInput from './components/MultipleInput.vue'

const storeList = {
  pageList: '/bus/cms/agency/store/list',
  detail: (id: number) => `/bus/cms/agency/store/info/${id}`,
  update: '/bus/cms/agency/store/save',
  selectList: '/bus/cms/agency/store/select-list'
}
const InitPageRef = ref()
const initPageData = reactive<IPage>({
  request: { // 接口
    listUrl: {
      url: storeList.pageList,
      method: 'get'
    },
    detailUrl: {
      url: storeList.detail,
      method: 'get'
    },
    addUrl: {
      url: storeList.update,
      method: 'post'
    },
    updateUrl: {
      url: storeList.update,
      method: 'post'
    }
  },
  getFieldList: getFieldList,
  buttonList: [ // 操作按钮
    {
      label: '详情',
      click: ({ row }: any) => {
        initPageData.title = '编辑机构'
        InitPageRef.value.showDetail(row.id)
        // 禁用机构名称字段
        nextTick(() => {
          const formMethods = InitPageRef.value.getAddFormMethods()
          formMethods.updateFieldProperty('agencyId', 'componentProps.disabled', true)
        })
      }
    }
  ],
  operateWidth: 200,
  title: '新增机构',
  confirmText: '保存机构'
})

// @todo，处理表格按钮和详情获取及回显

// @todo，处理一下页面的样式和滚动条，分页
</script>