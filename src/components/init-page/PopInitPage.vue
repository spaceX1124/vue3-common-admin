<template>
  <Dialog
    v-model="show"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    :title="popTitle"
    :width="popWidth"
    hiddenFooter
  >
    <div>
      <div class="initPageContent h-full flex flex-col">
        <!-- 新增区域 -->
        <div class="mb-3">
          <slot name="add-before"/>
          <el-button type="primary" @click="add" v-if="!initPageData.hiddenAdd">新增</el-button>
          <slot name="add-after"/>
        </div>
        <!-- 搜索区域 -->
        <SearchForm
          :getFieldList="initPageData.getFieldList"
          @search="search"
          @clearForm="clearForm"
        >
          <template
            v-for="slotName in delegatedSlots"
            :key="slotName"
            #[slotName]="slotProps"
          >
            <slot :name="slotName" v-bind="slotProps"/>
          </template>
        </SearchForm>
        <!-- 表格区域 -->
        <div class="tableBox flex-1 overflow-hidden">
          <Table/>
        </div>
      </div>
      <!-- 新增表单弹窗 -->
      <AddForm
        v-if="addFormVisible"
        v-model="addFormVisible"
        :getFieldList="initPageData.getFieldList"
        :addUrl="initPageData.request.addUrl"
        :updateUrl="initPageData.request.updateUrl"
        :detailUrl="initPageData.request.detailUrl"
        :title="initPageData.title"
        :dataId="dataId"
      >
        <template
          v-for="slotName in delegatedSlots"
          :key="slotName"
          #[slotName]="slotProps"
        >
          <slot :name="slotName" v-bind="slotProps"/>
        </template>
      </AddForm>
    </div>
  </Dialog>
</template>
<script lang="ts" setup>
import Dialog from '@/components/common/dialog/Dialog.vue'
import AddForm from '@/components/add-form/AddForm.vue'
import SearchForm from '@/components/search-form/SearchForm.vue'

import { computed, ref, useSlots } from 'vue'

import type { ISchema } from '@/adapter'
import { useTable } from '@/packages/VxeTable'
import type { IPage } from '@/types/business.ts'

interface PropsType {
  initPageData: IPage;
  popTitle?: string;
  popWidth?: string;
}
const props = withDefaults(defineProps<PropsType>(), {
  popWidth: '90%'
})

const show = defineModel<boolean>()

const slots = useSlots()
const delegatedSlots = computed(() => {
  const resultSlots: string[] = []
  const outside = ['default', 'add-before', 'add-after']
  for (const key of Object.keys(slots)) {
    if (!outside.includes(key)) {
      resultSlots.push(key)
    }
  }
  return resultSlots
})

// 表格hooks
const [Table, tableMethods] = useTable({
  schema: props.initPageData.getFieldList() as ISchema[],
  listApi: props.initPageData.request.listUrl,
  height: 'auto',
  buttonList: props.initPageData.buttonList || [],
  operateWidth: props.initPageData.operateWidth || 120
})

// -----------------
// 新增表单部分
const addFormVisible = ref(false)
const dataId = ref<string | number>() // 数据id
function add () {
  addFormVisible.value = true
  dataId.value = ''
}

defineExpose({
  showDetail: (id: string) => {
    dataId.value = id
    addFormVisible.value = true
  }
})

// -----------------
// 搜索部分
function search (data: Record<string, any>) {
  tableMethods.updateSearchData(data)
}
function clearForm () {
  tableMethods.updateSearchData({})
}
</script>