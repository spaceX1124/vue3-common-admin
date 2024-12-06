import type { Component } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'

interface IContextMenuItem {
    handler?: (data: any) => void; // 点击事件处理
    icon?: Component; // 图标
    inset?: boolean; // 是否显示图标
    key: string; // 唯一标识
    separator?: boolean; // 是否是分割线
    shortcut?: string; // 快捷键
    text: string; // 标题
}

export interface TabsProps {
    active?: string; // 当前选中的tab
    contentClass?: string;
    contextMenus?: (data: any) => IContextMenuItem[]; // 右键菜单
    draggable?: boolean; // 是否可以拖拽
    gap?: number; // 间隙
    maxWidth?: number; // 最大宽度
    minWidth?: number; // tab最小宽度
    showIcon?: boolean; // 是否显示图标
    tabs?: RouteLocationNormalized[]; // 选项卡数据
}