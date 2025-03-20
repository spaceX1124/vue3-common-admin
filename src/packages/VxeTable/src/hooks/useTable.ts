import { defineComponent, h } from 'vue'
import VxeTable from '../VxeTable.vue'
import type { ITableProps } from '../type'
import { TableMethods, type ITableMethodsProps } from '../tableMethods'

export function useTable (options: ITableMethodsProps) {
  // 暴露给外部使用的一些方法
  const tableMethods = new TableMethods(options)
  // 要渲染的表格
  const Table = defineComponent(
    (props: ITableProps, { attrs, slots }) => {
      // 将表格方法传递给表格组件
      return () => h(VxeTable, { ...props, ...attrs, tableMethods }, slots)
    })
  // 返回一个数组，第一个元素是表格组件，第二个元素是表格的方法
  return [Table, tableMethods] as const // as const 解决类型问题
}