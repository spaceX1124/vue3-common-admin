/**
 * 处理表头数据
 * @params 原始column数据 | 异步api接口
 * */
import { computed, onBeforeMount, ref, h } from 'vue'
import type { TableMethods } from '../tableMethods'
import { isEmpty, isFunc, isNullOrUndefOrEmpty } from '@/utils/is'
import type { VxeGridPropTypes } from 'vxe-table'
import { globalShareState } from '@/global/globalState.ts'
interface IColumnProp {
  tableMethods: TableMethods;
}
export function useColumn ({ tableMethods }: IColumnProp) {
  const components = globalShareState.getComponents()
  // 这是表头需要的数据
  // const columns = ref<Recordable[]>([])
  const showColumns = computed(() => {
    const newColumns = tableMethods.schema.value
    .filter(item => (item.useTable && !(isFunc(item.tableHidden) ? item.tableHidden() : item.tableHidden)))
    .map((schema) => {
      // @todo 要怎么去渲染表格内容，不能直接把接口返回的数据直接渲染
      // 格式化显示内容
      const renderData: VxeGridPropTypes.Column = {
        field: schema.fieldKey,
        title: schema.fieldName,
        width: schema.width,
        showOverflow: true,
        sortable: schema.sortConfig && !isEmpty(schema.sortConfig) // 该字段是否参与排序
        // visible: !schema.tableHidden // 该字段不在表格中显示，不用这个字段控制显隐，field可能会重复
      }
      // 处理表格内容渲染-----------开始
      /**
       * 渲染优先级：slots>formatter
       * 都设置cellRenderer和isEcho，以cellRenderer渲染
       * */
      // 处理外部自定义内容渲染函数
      if (schema.cellRenderer) {
        renderData.slots = {
          // 自定义显示内容模板
          default: (obj) => schema.cellRenderer && schema.cellRenderer({ ...obj, schema })
          // ...自定义表头内容的模板
        }
      }
      // 不是将表格数据直接渲染，而是根据表格的值，从数据中匹配对应的名称回显
      // 这儿只是处理了下拉框，单选框，多选框，其他复杂的组件，暂未实现
      else if (schema.isEcho) {
        // 设置格式化函数
        renderData.formatter = ({ cellValue, row, column }) => {
          if (isNullOrUndefOrEmpty(cellValue)) {
            return '-'
          }
          const findItem = schema?.componentProps?.options.find((item: Recordable) => String(item[schema?.async?.value || 'value']) === String(cellValue))
          return findItem ? findItem[schema?.async?.label || 'label'] : cellValue
        }
      } else {
        renderData.formatter = ({ cellValue, row, column }) => {
          if (isNullOrUndefOrEmpty(cellValue)) {
            return '-'
          }
          return cellValue
        }
      }
      // -----------结束
      return renderData
    })
    // 不隐藏序号，那就加上
    if (!tableMethods.hiddenSeq) {
      newColumns.unshift({ type: 'seq', width: 60 })
    }

    if(tableMethods.buttonList.length) {
      newColumns.push({
        title: '操作',
        width: tableMethods.operateWidth,
        fixed: 'right',
        slots: {
          default: (obj) => {
            return tableMethods.buttonList.map((item) => {
              const show = isFunc(item.show) ? item.show(obj) : true
              if (!show) return ''
              return h(components.DefaultButton,
                {
                  type: 'primary',
                  size: 'small',
                  onClick: () => item.click && item.click(obj)
                },
                () => item.label
              )
            })
          }
        }
      })
    }
    return newColumns
  })

  /**
   * 处理成vxe-grid表格需要的表头数据结构
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