// 偏好配置所需类型

// 权限模式(backend 后端接口返回 | frontend 前端直接定义路由表)
export type AccessModeType = 'backend' | 'frontend';

// 全局配置
interface AppPreferences {
    accessMode: AccessModeType; // 权限模式
    defaultAvatar: string; // 应用默认头像
    watermark: boolean; // 是否开启水印
    name: string; // 项目标题
}

// 侧边栏配置
interface SidebarPreferences {
    collapsed: boolean; // 侧边栏是否折叠
    collapsedShowTitle: boolean; // 侧边栏折叠时，是否显示title
    expandOnHover: boolean; // 菜单自动展开状态
    width: number; // 侧边栏宽度
    hidden: boolean; // 侧边栏是否隐藏
}

// header配置
interface headerPreferences {
    height: number; // header高度
}

// 整个项目偏好设置配置就在这
export interface Preferences {
    app: AppPreferences; // 全局配置
    sidebar: SidebarPreferences; // 侧边栏配置
    header: headerPreferences;// header配置
}