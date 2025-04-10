import { ref, type Ref } from 'vue'
import type { ISchema } from '@/adapter'
import type { IApi } from './type'

export interface ITableMethodsProps {
  schema: ISchema[]; // 表头数据结构
  listApi: IApi; // 表格数据接口
  hiddenSeq?: boolean; // 是否隐藏序号
  hiddenPager?: boolean; // 是否隐藏分页
  height?: string; // 表格高度
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
  constructor (options: ITableMethodsProps) {
    this.schema = ref(options.schema)
    this.listApi = options.listApi
    this.hiddenSeq = options.hiddenSeq || false
    this.hiddenPager = options.hiddenPager || false
    this.height = options.height || ''
  }
}