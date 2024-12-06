// 菜单所需类型
import type { Component } from 'vue'
// Menu菜单组件接受的参数类型
export interface MenuProps {
    accordion?: boolean; // 是否只展开一个SubMenu
    collapse?: boolean; // 菜单是否折叠
    collapseShowTitle?: boolean; // 菜单折叠时是否显示菜单名称
    defaultActive?: string; // 默认激活的菜单
    defaultOpends?: string[]; // 默认展开的菜单
    rounded?: boolean; // 是否圆润风格
}

// subMenu组件接受的参数类型
export interface SubMenuProps {
    path: string; // 名称
    icon?: Component | string; // 图标
}
// MenuItem组件接收的参数
export interface MenuItemProps {
    path: string; // 名称
    icon?: Component | string; // 图标
}

// 菜单原始数据对象
export interface MenuRecordRaw {
    title: string; // 菜单名
    name: string; // 用于路由名称
    path: string; // 菜单路径，唯一，可当作key
    children?: MenuRecordRaw[]; // 子菜单
    icon?: Component | string; // 图标名
    order?: number; // 排序号
    show?: boolean; // 是否显示菜单
    id?: number;
}

interface MenuItemRegistered {
    active: boolean;
    parentPaths: string[];
    path: string;
}

// 点击MenuItem菜单项传递的参数
export interface MenuItemClicked {
    parentPaths: string[];
    path: string;
}
// 点击SubMenu菜单项传递的参数
export interface SubMenuClicked {
    active: boolean;
    parentPaths: string[];
    path: string;
}
// Menu菜单provide提供的
export interface MenuProvider {
    handleMenuItemClick: (item: MenuItemClicked) => void; // MenuItem菜单项的点击事件
    handleSubMenuClick: (item: SubMenuClicked) => void; // SubMenu菜单项的点击事件
    openedMenus: string[]; // 当前展开的 SubMenu 菜单项
    openMenu:(path: string, parentLinks: string[]) => void; // 点击展开菜单
    activePath?: string; // 当前选中的菜单
    items: Record<string, MenuItemRegistered>; // 将所有MenuItem项的path和父级链路parentPaths和active是否选中状态存在这里面
    subMenus: Record<string, MenuItemRegistered>; // 将所有SubMenu项的path和父级链路parentPaths和active是否选中状态存在这里面
    addMenuItem: (item: MenuItemRegistered) => void; // 为items注入MenuItemRegistered数据
    addSubMenu: (item: MenuItemRegistered) => void;// 为subMenus注入MenuItemRegistered数据
    removeMenuItem: (item: MenuItemRegistered) => void;// 根据MenuItemRegistered的path，从items中去除
    removeSubMenu: (item: MenuItemRegistered) => void;// 根据MenuItemRegistered的path，从subMenus中去除
    props: MenuProps;
    isMenuPopup: boolean;
    closeMenu: (path: string, parentLinks: string[]) => void;
}
// SubMenu菜单provide提供的
export interface SubMenuProvider {
    addSubMenu: (item: MenuItemRegistered) => void;
    handleMouseleave?: (deepDispatch: boolean) => void;
    level: number;
    mouseInChild: Ref<boolean>;
    removeSubMenu: (item: MenuItemRegistered) => void;
}