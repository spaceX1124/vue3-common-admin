import { ref, type Ref } from 'vue'
import type { ISchema } from '@/adapter'
import type { IApi, IButton, IPaper } from './type'
import { http } from '@/packages/utils/http'
import { type VxeGridInstance } from 'vxe-table'

export interface ITableMethodsProps {
  schema: ISchema[]; // 表头数据结构
  listApi: IApi; // 表格数据接口
  hiddenSeq?: boolean; // 是否隐藏序号
  hiddenPager?: boolean; // 是否隐藏分页
  height?: string; // 表格高度
  buttonList?: IButton[]; // 表格操作按钮
  operateWidth?: number; // 操作列的宽度
}
/**
 * 操作表单的一些方法
 * */
export class TableMethods {
  public schema: Ref<ISchema[]> // 贯穿整个表格的表头数据
  public listApi: IApi // 表格列表数据接口
  public hiddenSeq: boolean // 是否展示序号
  public hiddenPager: boolean // 是否隐藏分页
  public height: string // 表格高度
  public buttonList: IButton[] = [] // 表格操作按钮
  public operateWidth: number = 120 // 表格操作列的宽度
  public tableData: Ref<Record<string, any>[]> // 这是表格需要展示的数据
  public loading: Ref<boolean> // 表格数据加载状态
  public pagerData: Ref<IPaper> // 分页数据
  public searchData: Ref<Record<string, any>> // 表格搜索数据
  public sortData: Ref<Record<string, any>> // 排序数据
  public gridRef: Ref<VxeGridInstance | null> // 表格ref
  constructor (options: ITableMethodsProps) {
    this.schema = ref(options.schema)
    this.listApi = options.listApi
    this.hiddenSeq = options.hiddenSeq || false
    this.hiddenPager = options.hiddenPager || false
    this.height = options.height || ''
    this.buttonList = options.buttonList || []
    this.operateWidth = options.operateWidth || 120

    this.pagerData = ref({
      current: 1,
      size: 10,
      total: 0
    })
    this.loading = ref(false)// 表格数据加载状态
    this.tableData = ref([]) // 表格数据
    this.searchData = ref({}) // 搜索数据
    this.sortData = ref({}) // 排序数据
    this.gridRef = ref(null)
  }

  /**
   * 获取api表格数据
   * */
  async getApiDataList () {
    this.loading.value = true
    const { url, method, data } = this.listApi

    // @todo，考虑下不分页的时候，这个参数问题
    const postData = {
      current: this.pagerData.value.current,
      size: this.pagerData.value.size,
      ...data,
      ...this.searchData.value,
      ...this.sortData.value
    }
    const result = await http[method](url, postData)
    this.loading.value = false

    // @todo,赋值的时候可能还要考虑分页问题，不分页可能数据就不在records
    this.tableData.value = result.records
    this.pagerData.value.total = result.total
    return result
  }

  /**
   * 获取字段
   * @param fieldKey 字段的键
   * */
  getField (fieldKey: string) {
    return this.schema.value.find(item => item.fieldKey === fieldKey && item.useTable)
  }

  /**
   * 处理表头异步和表格数据
   * */
  async dealApiColumnTableData () {
    // 需要异步获取数据的字段
    const apiColumnList = this.schema.value.filter(schema => schema.async && schema.useTable)
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
      const resultList = await Promise.all([...apiColumnFn.map(fn => fn()), this.getApiDataList()])
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
    } else {
      await this.getApiDataList()
    }
  }

  /**
   * 更新搜索数据并刷新表格
   * */
  async updateSearchData (data: Record<string, any>) {
    this.searchData.value = data
    await this.getApiDataList()
  }

  /**
   * 更新分页相关，并刷新表格
   * */
  async updatePagerData (data: IPaper) {
    this.pagerData.value = {
      ...this.pagerData.value,
      ...data
    }
    await this.getApiDataList()
  }

  /**
   * 更新排序数据并刷新表格
   * */
  async updateSortData (data: Record<string, any>) {
    this.sortData.value = data
    await this.getApiDataList()
  }

  /**
   * 设置schema的JSON数据
   * */
  setSchema (schema: ISchema[]) {
    this.schema.value = schema
  }

  /**
   * 设置表格ref
   * */
  setGridRef (ref: Ref<VxeGridInstance | null>) {
    this.gridRef.value = ref.value
  }

  /**
   * 重置分页数据
   * */
  resetPagerData () {
    this.pagerData.value = {
      current: 1,
      size: 10,
      total: 0
    }
  }

  /**
   * 重置排序参数
   * */
  resetSortData () {
    this.sortData.value = {}
  }

  /**
   * 重置搜索条件
   * */
  resetSearchData () {
    this.searchData.value = {}
  }

  /**
   * 重置选中
   * */
  resetSelected () {
    if (this.gridRef.value) {
      this.gridRef.value.clearCheckboxRow()
    }
  }
  
  /**
   * 重置分页、重置排序、重置搜索条件、重置选中
   * */
  initial () {
    this.resetPagerData()
    this.resetSortData()
    this.resetSearchData()
    this.resetSelected()
  }
}