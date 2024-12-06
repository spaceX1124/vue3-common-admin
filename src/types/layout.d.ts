// 使用layout组件时需要传递的参数
export interface LayoutProps {
    sidebarWidth?: number; // 侧边栏宽度
    collapseWidth?: number; // 侧边栏折叠之后的宽度
    sidebarCollapse?: boolean; // 侧边菜单折叠状态
    tabBarHeight?: number; // tabBar高度
    headerHeight?: number; // header高度
    sidebarHidden?: boolean; // 是否隐藏侧边栏
}