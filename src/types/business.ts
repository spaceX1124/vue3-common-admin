import type { FormMethods } from '@/packages/Forms'
import type { ISchema } from '@/adapter'
import type { TableMethods } from '@/packages/VxeTable'

export interface IApi {
    url: string | ((data?: any ) => string); // 如(id: number) => `/bus/cms/customer/profile/status-change/${id}`
    method: string;
    data?: Record<string, any>;
}

/**
 * 表格操作按钮
 * */
export interface IButton {
    label: string; // 按钮名称
    show?:(data?: any) => boolean; // 控制按钮显示
    click?:(data?: any) => void; // 按钮点击事件
}
export interface IRequest {
    listUrl: IApi; // 表格数据接口
    addUrl?: IApi; // 新增接口
    updateUrl?: IApi; // 修改接口
    detailUrl?: IApi; // 详情接口
}
export interface IGetFieldListParams {
    formMethods?: FormMethods
    tableMethods?: TableMethods
    searchMethods?: FormMethods
}
/**
 * 通用页面配置
 * */
export interface IPage {
    request: IRequest;
    getFieldList: (params?: IGetFieldListParams) => ISchema[]; // 字段数据
    title?: string; // 表单的标题
    confirmText?: string; // 表单确认按钮文字
    buttonList?: IButton[]; // 表格操作按钮
    operateWidth?: number; // 操作列的宽度
    hiddenAdd?: boolean; // 隐藏新增按钮
    hiddenSearch?: boolean; // 隐藏搜索区域
    oneTabList?: {label: string, value: string}[] // 1级tab切换
    twoTabList?: {label: string, value: string}[] // 2级tab切换
}