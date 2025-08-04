import type { ISchema } from '@/adapter'
export type { TableMethods } from './tableMethods'

export interface IApi {
    url: string | Function;
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

/**
 * 表格操作按钮
 * */
export interface IButton {
    label: string; // 按钮名称
    show?:(data?: any) => boolean; // 控制按钮显示
    click?:(data?: any) => void; // 按钮点击事件
}

/**
 * 分页
 * */
export interface IPaper {
    current?: number; // 当前页
    size?: number; // 每页显示多少条
    total?: number;
}