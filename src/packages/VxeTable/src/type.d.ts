import type { ISchema } from '@/adapter'

export interface IApi {
    url: string;
    method: string;
    data?: Recordable;
}

export interface ITableProps {
    // 这儿可以扩展，后期如果需要再组件标签上传递属性
    // a: number;
}
export interface IGridProps {
    schema: ISchema[]; // 表头源数据结构
    listApi: IApi; // 表格数据接口
}