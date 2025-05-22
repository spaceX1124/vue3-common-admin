/**
 * 定义通用类型
 * 用于包，页面使用
 * */

import type { ComponentType } from './component'
import { type Component } from 'vue'

/**
 * 表格，表单，搜索，所需数据结构
 * */
export interface ISchema {
    component: ComponentType; // 组件类型
    fieldKey: string; // 字段key
    fieldKeyArr?: string[]; // 区间使用
    fieldName?: string; // 字段名称
    componentProps?: Recordable; // UI框架中的props
    componentEvent?: Recordable; // UI框架中的event
    formItemClass?: string; // 表单项的栅格布局, 如 'col-span-2 col-start-2'， 占满2列空间 从第二列开始 相当于前面空了一列;col-span-full
    labelWidth?: number; // 表单项的label宽度
    hideLabel?: boolean; // 隐藏label
    required?: boolean; // 是否必填
    rules?: // 可不必填的情况下也定义规则，满足规则才能校验通过
        | ((value: any) => string | boolean | Promise<string | boolean>)
        | { regExp: RegExp; msg: string; }; // 自定义校验，可以是一个函数(也可以异步校验)，也可以是一个正则表达式
    async?: { // 需要异步请求数据
        url: string; // 接口地址
        method: string; // 接口方法
        label?: string; // 自定义选项名称
        value?: string; // 自定义选项值
        data?: Recordable; // 接口参数,
        remote?: boolean; // 是否开启远程输入搜索
        remoteKey?: string; // 远程输入搜索所需key
        hiddenOptions?: string | ((data: Recordable) => boolean); // 需要隐藏的项，确定要隐藏的项的id，可传入字符串（多个逗号分隔），不确定可通过函数处理
        disabledOptions?: string | ((data: Recordable) => boolean); // 需要置灰的项，确定要置灰的项的id，可传入字符串（多个逗号分隔），不确定可通过函数处理
    };
    isEcho?: boolean; // 表格回显，如后端返id，需要匹配然后回显就传true，直接展示后端返回不传或设为false即可
    cellRenderer?: (obj: any) => any // 表格自定义渲染内容，如jsx语法等，可拿到最新的表头数据，有那种异步获取数据注入到表头的，@TODO，如何处理自定义渲染操作变更渲染内容
    extraConfig?: {
        isAll?: boolean; // 复选框是否展示全选
        minPlaceholder?: string; // 最小值提示
        maxPlaceholder?: string; // 最大值提示
    },
    width?: string; // 表头宽度
    search?: boolean; // 该字段是否用于搜索
    formHidden?: boolean | (() => boolean); // 该字段是否在表单中隐藏
    tableHidden?: boolean | (() => boolean); // 该字段是否在表格中隐藏
    valueFormatter?: {
        to?: (value: any) => any; // 将值处理成后端需要的
        from?: (value: any) => any; // 将值处理成前端需要的
    }; // 处理表单值的格式化，如金额（输入100元，传参需要转分，100*100）
    renderComponentSlotContent?:() => Record<string, any>; // 组件插槽内容，如输入框的suffix
    slotContent?: {
        bottom?: (() => Component | string) | string; // 组件底部插槽内容
    };
    defaultValue?: any; // 默认值
    myComponentRef?: any; // 当前组件实例，不需要传入，内部会自动设置该值，可用于访问组件
    insideComp?: { // 组件内部方法，用于在外部访问
        refresh?: () => Promise<void>; // 刷新组件
    };
    beforeMount?: (value: any) => void; // 当表单值设置了之后去执行，如，字段A的值控制字段B的显隐，A字段异步下拉等，只执行一次
    sortConfig?: {
        sortKey: string; // 映射字段所需的key
        sortValue: string | number; // 映射字段所需的值
        sortTypeKey: string; // 升序/降序所需的key
    }
}
