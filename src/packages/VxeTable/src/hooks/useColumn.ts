/**
 * 处理表头数据
 * @params 原始column数据 | 异步api接口
 * */
import { computed, onBeforeMount, ref } from 'vue'
import type { TableMethods } from '../tableMethods'
import { isNullOrUndefOrEmpty } from '@/utils/is'
import type { VxeGridPropTypes } from 'vxe-table'
interface IColumnProp {
  tableMethods: TableMethods;
}
export function useColumn ({ tableMethods }: IColumnProp) {
  // 这是表头需要的数据
  // const columns = ref<Recordable[]>([])
  const showColumns = computed(() => {
    const newColumns = tableMethods.schema.value.map((schema) => {
      // @todo 要怎么去渲染表格内容，不能直接把接口返回的数据直接渲染
      // 格式化显示内容
      const renderData: VxeGridPropTypes.Column = {
        field: schema.fieldKey,
        title: schema.fieldName
      }
      // 处理表格内容渲染-----------开始
      /**
       * 渲染优先级：slots>formatter
       * 都设置cellRenderer和isEcho，以cellRenderer渲染
       * */
      // 处理外部自定义内容渲染函数
      if (schema.cellRenderer) {
        renderData.slots = {
          default: (obj) => schema.cellRenderer && schema.cellRenderer({ ...obj, schema })
        }
      }
      // 不是将表格数据直接渲染，而是根据表格的值，从数据中匹配对应的名称回显
      // 这儿只是处理了下拉框，单选框，多选框，其他复杂的组件，暂未实现
      if (schema.isEcho) {
        // 设置格式化函数
        renderData.formatter = ({ cellValue, row, column }) => {
          if (isNullOrUndefOrEmpty(cellValue)) {
            return '-'
          }
          const findItem = schema?.componentProps?.options.find((item: Recordable) => String(item[schema?.async?.value || 'value']) === String(cellValue))
          return findItem ? findItem[schema?.async?.label || 'label'] : cellValue
        }
      }
      // -----------结束
      return renderData
    })
    // 不隐藏序号，那就加上
    if (!tableMethods.hiddenSeq) {
      newColumns.unshift({ type: 'seq', width: 60 })
    }
    return newColumns
  })

  /**
   * 处理成vxe-grid表格需要的表头数据借楼
   * */
  // function dealColumn () {
  //   columns.value = tableMethods.schema.value.map((item) => {
  //     // @todo 要怎么去渲染表格内容，不能直接把接口返回的数据直接渲染
  //     // 格式化显示内容
  //     return {
  //       field: item.fieldKey,
  //       title: item.fieldName,
  //       ...item
  //     }
  //   })
  // }
  onBeforeMount(() => {
  })
  return {
    showColumns
  }
}