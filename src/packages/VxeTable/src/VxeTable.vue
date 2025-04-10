<template>
  <vxe-grid ref="gridRef" v-bind="vxeGridOptions">
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
import { computed, onMounted, nextTick } from 'vue'
import type { VxeGridProps } from 'vxe-table'
// 不能升级，目前4.8.11没问题，升级之后，引入会报Cannot resolve symbol 'VxeGrid'
import { VxeGrid } from 'vxe-table'
import 'vxe-table/lib/style.css'
import { VxeUI, VxeLoading } from 'vxe-pc-ui'
import 'vxe-pc-ui/lib/style.css'
import './style.css'
VxeUI.component(VxeLoading)

import type { TableMethods } from './tableMethods'
import { useColumn } from './hooks/useColumn'
import { useDataList } from './hooks/useDataList'
import type { ITableProps } from './type'
import ZsLoading from './components/loading.vue'

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
 * 处理表格数据
 * */
const { tableData, loading, pagerData } = useDataList({ tableMethods: props.tableMethods })

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
    data: tableData.value, // 表格数据
    // height: '100%', // 表格高度
    minHeight: 180,
    loading: loading.value, // 数据加载状态
    columnConfig: {
      resizable: true // 列宽是否可以拖动
    }
  }
  if(props.tableMethods.height) {
    options.height = props.tableMethods.height
  }
  // 如果不隐藏分页
  if (!props.tableMethods.hiddenPager) {
    // 设置分页配置可显示分页功能
    options.pagerConfig = {
      pageSize: pagerData.value.pageSize,
      currentPage: pagerData.value.pageNum,
      total: pagerData.value.total,
      background: true,
      pageSizes: [10, 20, 30, 50, 100, 200],
      className: 'mt-2 w-full',
      layouts: ['Total', 'Sizes', 'Home', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'End'],
      size: 'mini' as const
    }
  }
  console.log(options, 'options')
  return options
})

</script>
