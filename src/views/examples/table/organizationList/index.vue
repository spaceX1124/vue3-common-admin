<template>
  <Page auto-content-height>
    <InitPage
      ref="InitPageRef"
      :initPageData="initPageData"
      @closeDetail="closeDetail"
    >
      <template #businessLicense="slotProps">
        <MultipleUpload
          v-bind="{
            ...slotProps
          }"
          :field-key-arr="['businessLicense', 'doorPhoto', 'sitePhoto', 'venueVideo', 'contractPhoto']"
        />
      </template>
    </InitPage>
  </Page>
</template>
<script lang="tsx" setup>
import { reactive, ref, nextTick } from 'vue'
import Page from '@/components/page/Page.vue'
import InitPage from '@/components/init-page/InitPage.vue'
import { getFieldList1, getFieldList2, getFieldList3 } from './index'
import MultipleUpload from './components/MultipleUpload.vue'

import type { IPage } from '@/types/business.ts'

const organizationList = {
  pageList: '/bus/cms/agency/list',
  detail: (id: number) => `/bus/cms/agency/info/${id}`,
  update: '/bus/cms/agency/save',
  selectList: '/bus/cms/agency/select-list'
}

const accountList = {
  recharge: '/bus/cms/account/recharge',
  refund: '/bus/cms/account/refund',
  sendCode: '/bus/cms/account/sendCode'
}
const InitPageRef = ref()
const initPageData = reactive<IPage>({
  request: { // 接口
    listUrl: {
      url: organizationList.pageList,
      method: 'get'
    },
    detailUrl: {
      url: organizationList.detail,
      method: 'get'
    },
    addUrl: {
      url: organizationList.update,
      method: 'post'
    },
    updateUrl: {
      url: organizationList.update,
      method: 'post'
    }
  },
  getFieldList: getFieldList1,
  buttonList: [ // 操作按钮
    {
      label: '详情',
      click: ({ row }: any) => {
        initPageData.title = '编辑机构'
        InitPageRef.value.showDetail(row.id)
      }
    },
    {
      label: '充值',
      click: ({ row }: any) => {
        initPageData.title = '充值'
        initPageData.confirmText = '完成充值'
        initPageData.getFieldList = getFieldList2
        initPageData.request.addUrl = {
          url: accountList.recharge,
          method: 'post',
          data: {
            ownerId: row.employeesId,
            ownerType: '2'
          }
        }
        InitPageRef.value.add()
        // @todo，如何设置表单部分默认值
        nextTick(() => {
          const formMethods = InitPageRef.value.getAddFormMethods()
          formMethods.setFieldsValue({
            name: row.name,
            simpleName: row.simpleName,
            id: row.id,
            account: row.account
          })
        })
      }
    },
    {
      label: '退款',
      click: ({ row }: any) => {
        initPageData.title = '退款'
        initPageData.confirmText = '完成退款'
        initPageData.getFieldList = getFieldList3
        initPageData.request.addUrl = {
          url: accountList.refund,
          method: 'post',
          data: {
            ownerId: row.employeesId,
            ownerType: '2'
          }
        }
        InitPageRef.value.add()
        // @todo，如何设置表单部分默认值
        nextTick(() => {
          const formMethods = InitPageRef.value.getAddFormMethods()
          formMethods.setFieldsValue({
            name: row.name,
            simpleName: row.simpleName,
            id: row.id,
            account: row.account,
            balance: row.balance,
            refundableBalance: row.refundableBalance
          })
        })
      }
    }
  ],
  operateWidth: 200,
  title: '新增机构',
  confirmText: '保存机构'
})

// 恢复机构相关字符和接口
function closeDetail () {
  initPageData.getFieldList = getFieldList1
  initPageData.request.addUrl = {
    url: organizationList.update,
    method: 'post'
  }
  initPageData.title = '保存机构'
}

// @todo，处理表格按钮和详情获取及回显

// @todo，处理一下页面的样式和滚动条，分页
</script>