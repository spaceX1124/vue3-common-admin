<template>
  <vxe-grid ref="gridRef" class="myGrid" v-bind="vxeGridOptions" v-on="events">
    <!-- 数据加载动画loading -->
    <template #loading>
      <ZsLoading :spinning="true"/>
    </template>
    <!-- 统一控状态 -->
    <template #empty>
      <slot name="empty">
        <div class="mt-2">暂无数据</div>
      </slot>
    </template>
  </vxe-grid>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, onMounted, ref } from 'vue'
import type { VxeGridProps } from 'vxe-table'
// 不能升级，目前4.8.11没问题，升级之后，引入会报Cannot resolve symbol 'VxeGrid'
import { VxeGrid, type VxeGridListeners, type VxeGridInstance } from 'vxe-table'
import 'vxe-table/lib/style.css'
import { VxeUI, VxeLoading } from 'vxe-pc-ui'
import 'vxe-pc-ui/lib/style.css'
import './style.scss'
VxeUI.component(VxeLoading)

import type { TableMethods } from './tableMethods'
import { useColumn } from './hooks/useColumn.tsx'
import type { ITableProps } from './type'
import ZsLoading from './components/loading.vue'
import { isEmpty } from '@/packages/utils/is.ts'

interface PropsType extends ITableProps{
  tableMethods: TableMethods
}

// 目前只有tableMethods有值，因为useTable.ts中手动传了实例
// 其他属性目前都没有值，因为在外部使用组件的时候什么都没有传，
// 后续往IGridProps中取加需要的属性
const props = defineProps<PropsType>()

// state.schema必须是个ref，这样我在传入并修改的时候能够同步更新

/**
 * 处理表头数据
 * @param sourceColumn 源列配置数据
 * */
const { showColumns } = useColumn({ tableMethods: props.tableMethods })

/**
 * 当接收到表头字段之后，应该如何处理成表格需要的数据结构
 * 如何控制单选
 * 如何控制多选
 * 如何实现自定义渲染表格内容
 * 如何实现在表格内部双击编辑，编辑的时候要渲染成对应的组件出来
 * 如何实现整行的编辑
 * */

// 给vxe-grid绑定属性
const vxeGridOptions = computed(() => {
  // @todo，不能在这设置高度，要从外面需要使用的地方传入，不然会卡顿缩放。
  const options: VxeGridProps = {
    columns: showColumns.value, // 表头
    data: props.tableMethods.tableData.value, // 表格数据
    // height: '100%', // 表格高度
    minHeight: 180,
    loading: props.tableMethods.loading.value, // 数据加载状态
    columnConfig: {
      resizable: true // 列宽是否可以拖动
    },
    align: 'center',
    border: true,
    pagerConfig: { // 分页配置
      pageSize: props.tableMethods.pagerData.value.size,
      currentPage: props.tableMethods.pagerData.value.current,
      total: props.tableMethods.pagerData.value.total,
      background: false,
      pageSizes: [10, 20, 30, 50, 100, 200],
      className: 'w-full',
      layouts: ['Total', 'Sizes', 'PrevPage', 'JumpNumber', 'NextPage', 'End'],
      size: 'mini',
      enabled: !props.tableMethods.hiddenPager // 隐藏分页
    },
    sortConfig: {
      trigger: 'cell' // 点击表头触发排序
    }
  }
  if(props.tableMethods.height) {
    options.height = props.tableMethods.height
  }
  return options
})

// 给vxe-grid绑定事件
const events: VxeGridListeners = {
  pageChange (data) {
    props.tableMethods.updatePagerData({ current: data.currentPage, size: data.pageSize })
  },
  sortChange (data) {
    const { field, order } = data
    const schema = props.tableMethods.getField(field)
    if (schema && schema.sortConfig && !isEmpty(schema.sortConfig)) {
      const { sortKey, sortValue, sortTypeKey } = schema.sortConfig
      const params = {
        [sortKey]: sortValue,
        [sortTypeKey]: order === 'desc' ? 0 : 1
      }
      // 恢复之后order为null
      props.tableMethods.updateSortData(order ? params : {})
    }
  }
}

onBeforeMount(() => {
  // 获取表格数据
  props.tableMethods.dealApiColumnTableData()
})

const gridRef = ref<VxeGridInstance | null>(null)
onMounted(() => {
  props.tableMethods.setGridRef(gridRef)
})
</script>
