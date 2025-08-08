<template>
  <div class="initPageContent h-full flex flex-col">
    <!-- tab切换区域 -->
    <!-- 1级tab切换区域 -->
    <!--    <div class="mb-3" v-if="initPageData.oneTabList">-->
    <!--      <el-button-->
    <!--        @click="oneTabClick(one.value)"-->
    <!--        v-for="(one, index) in initPageData.oneTabList"-->
    <!--        :key="index"-->
    <!--        :type="oneTabActive === one.value ? 'primary' : 'default'"-->
    <!--      >-->
    <!--        {{one.label}}-->
    <!--      </el-button>-->
    <!--    </div>-->
    <!-- 2级tab切换区域 -->
    <!--    <div class="mb-3" v-if="initPageData.twoTabList">-->
    <!--      <el-button-->
    <!--        @click="twoTabClick(two.value)"-->
    <!--        v-for="(two, index) in initPageData.twoTabList"-->
    <!--        :key="index"-->
    <!--        :type="twoTabActive === two.value ? 'primary' : 'default'"-->
    <!--      >-->
    <!--        {{two.label}}-->
    <!--      </el-button>-->
    <!--    </div>-->
    <!-- 新增区域 -->
    <div>
      <slot name="add-before"/>
      <el-button type="primary" @click="add" class="add-btn" v-if="!initPageData.hiddenAdd">新增</el-button>
      <slot name="add-after"/>
    </div>
    <!-- 搜索区域 -->
    <SearchForm
      v-if="!initPageData.hiddenSearch"
      :getFieldList="initPageData.getFieldList"
      @search="search"
      @clearForm="clearForm">
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
    ref="AddFormRef"
    :getFieldList="initPageData.getFieldList"
    :addUrl="initPageData.request.addUrl"
    :updateUrl="initPageData.request.updateUrl"
    :detailUrl="initPageData.request.detailUrl"
    :title="initPageData.title"
    :confirmText="initPageData.confirmText"
    :dataId="dataId"
    @closeDetail="closeDetail"
  >
    <template
      v-for="slotName in delegatedSlots"
      :key="slotName"
      #[slotName]="slotProps"
    >
      <slot :name="slotName" v-bind="slotProps"/>
    </template>
  </AddForm>
</template>
<script lang="ts" setup>
import AddForm from '@/components/add-form/AddForm.vue'
import SearchForm from '@/components/search-form/SearchForm.vue'

import { computed, ref, useSlots, nextTick, watch, onBeforeMount } from 'vue'

import { useTable } from '@/packages/ui/vxe-table'
import type { IPage } from '@/types/business.ts'

// @todo，考虑一下新增表单所用的配置传入问题

interface PropsType {
  initPageData: IPage
}

const props = defineProps<PropsType>()
const emit = defineEmits(['closeDetail', 'oneTabClick', 'twoTabClick'])

// -----------------
// 顶部tab部分
// const oneTabActive = ref(props.initPageData.oneTabList?.[0].value)
// const twoTabActive = ref(props.initPageData.twoTabList?.[0].value)
// function oneTabClick (value: string) {
//   oneTabActive.value = value
//   emit('oneTabClick', value)
// }
// function twoTabClick (value: string) {
//   twoTabActive.value = value
//   emit('oneTabClick', value)
// }

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

// -----------------
// 表格部分
const [Table, tableMethods] = useTable({
  schema: [],
  listApi: props.initPageData.request.listUrl,
  height: 'auto',
  buttonList: props.initPageData.buttonList || [],
  operateWidth: props.initPageData.operateWidth || 120
})

// 监听表头改变
watch(() => props.initPageData.getFieldList, () => {
  // 设置最新的表头
  tableMethods.setSchema(props.initPageData.getFieldList({ tableMethods }))
  // 重置分页、重置排序、重置搜索条件、重置选中
  tableMethods.initial()
  // 重新处理表头异步和表格数据
  tableMethods.dealApiColumnTableData()
})

// -----------------
// 新增表单部分
const AddFormRef = ref()
const addFormVisible = ref(false)
const dataId = ref<string | number>() // 数据id
function add () {
  addFormVisible.value = true
  dataId.value = ''
  nextTick(() => {
    console.log(AddFormRef.value.formMethods, 'AddFormRef.value.formMethods')
  })
}

defineExpose({
  showDetail: (id: string) => { // 显示详情
    dataId.value = id
    addFormVisible.value = true
  },
  add, // 显示新增表单
  getAddFormMethods: () => { // 获取新增表单实例
    return AddFormRef.value.formMethods
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

// 详情关闭时触发
function closeDetail () {
  emit('closeDetail')
}

onBeforeMount(() => {
  tableMethods.setSchema(props.initPageData.getFieldList({ tableMethods }))
})
</script>
<style lang="scss" scoped>
.initPageContent {
  .add-btn {
    margin-bottom: 12px;
  }
}
</style>
