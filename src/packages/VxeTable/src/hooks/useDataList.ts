/**
 * 处理表格数据
 * */
import { http } from '@/utils/http'
import { nextTick, onMounted, ref } from 'vue'
import type { TableMethods } from '../tableMethods'

interface ITableDataProp{
  tableMethods: TableMethods;
}
export function useDataList ({ tableMethods }: ITableDataProp) {
  // 这是表格需要展示的数据
  const tableData = ref<Recordable[]>([])
  // 表格数据加载状态
  const loading = ref(false)

  // 分页
  const pagerData = ref({
    pageNum: 1,
    pageSize: 100,
    total: 0
  })
  /**
   * 获取需要异步获取数据的字段
   * @return 得到表头的异步方法
   * */
  function getAllApiColumn () {
    const apiColumnList: PromiseFn[] = []
    tableMethods.schema.value.forEach(schema => {
      // 需要异步请求数据
      if (schema.async) {
        const { url, data, method } = schema.async
        // 处理数据格式
        const fn = async () => {
          return await http[method](url, { ...data })
        }
        apiColumnList.push(fn)
      }
    })
    return apiColumnList
  }

  /**
   * 获取api表格数据
   * */
  async function getApiDataList () {
    loading.value = true
    const { url, method, data } = tableMethods.listApi
    const postData = {
      pageNum: pagerData.value.pageNum,
      pageSize: pagerData.value.pageSize,
      ...data
    }
    const result = await http[method](url, postData)
    loading.value = false
    return result
  }

  /**
   * 处理表头异步和表格数据
   * */
  async function dealApiColumnTableData () {
    // 需要异步获取数据的字段
    const apiColumnList = tableMethods.schema.value.filter(schema => schema.async)
    // 如果有异步表头数据，就执行异步获取数据，否则就直接获取表格数据
    if (apiColumnList) {
      const apiColumnFn: PromiseFn[] = []
      apiColumnList.forEach(schema => {
        // 需要异步请求数据
        if (schema.async) {
          const { url, data, method } = schema.async
          // 处理数据格式
          const fn = async () => {
            return await http[method](url, { ...data })
          }
          apiColumnFn.push(fn)
        }
      })
      const resultList = await Promise.all([...apiColumnFn.map(fn => fn()), getApiDataList()])
      // 把异步表头的数据更新到最新的渲染表头数据中
      apiColumnList.forEach((item, index) => {
        if (item.componentProps) {
          item.componentProps.options = resultList[index]
        } else {
          item.componentProps = {
            options: resultList[index]
          }
        }
      })
      // @todo,赋值的时候可能还要考虑分页问题，不分页可能数据就不在records
      tableData.value = resultList[resultList.length - 1].records

      pagerData.value.total = resultList[resultList.length - 1].total
    } else {
      const result = await getApiDataList()
      // @todo,赋值的时候可能还要考虑分页问题，不分页可能数据就不在records
      tableData.value = result.records
      pagerData.value.total = result.total
    }
  }
  onMounted(async () => {
    await dealApiColumnTableData()
  })
  return {
    tableData,
    getApiDataList,
    loading,
    pagerData
  }
}
