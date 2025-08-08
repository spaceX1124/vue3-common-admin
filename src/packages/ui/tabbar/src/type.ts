import type { RouteLocationNormalized } from 'vue-router'
export interface TabsProps {
    active?: string; // 当前选中的选项卡
    tabs?: RouteLocationNormalized[]; // 选项卡数据
    wheelable?: boolean; // 开启滚轮滚动选项卡
}