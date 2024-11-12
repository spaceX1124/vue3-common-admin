// 偏好配置所需类型

// 权限模式(backend 后端权限模式 | frontend 前端权限模式)
export type AccessModeType = 'backend' | 'frontend';

export type ThemeModeType = 'auto' | 'dark' | 'light';

// 主题色名称（根据这些名称去设置对应的颜色）
type BuiltinThemeType =
    | 'custom'
    | 'deep-blue'
    | 'deep-green'
    | 'default'
    | 'gray'
    | 'green'
    | 'neutral'
    | 'orange'
    | 'pink'
    | 'red'
    | 'rose'
    | 'sky-blue'
    | 'slate'
    | 'stone'
    | 'violet'
    | 'yellow'
    | 'zinc'
    | (Record<never, never> & string);

interface AppPreferences {
    accessMode: AccessModeType; // 权限模式
    defaultAvatar: string; // 应用默认头像
    watermark: boolean; // 是否开启水印
    name: string; // 项目标题
}

interface SidebarPreferences {
    collapsed: boolean; // 侧边栏是否折叠
    collapsedShowTitle: boolean; // 侧边栏折叠时，是否显示title
    expandOnHover: boolean; // 菜单自动展开状态
    width: number; // 侧边栏宽度
}

interface ThemePreferences {
    builtinType: BuiltinThemeType; // 内置主题名称
    colorDestructive: string; // 错误色
    colorPrimary: string; // 主题色
    colorSuccess: string; // 成功色
    colorWarning: string; // 警告色
    mode: ThemeModeType; // 当前主题,'auto' | 'dark' | 'light'
}
// 整个项目偏好设置配置就在这
export interface Preferences {
    app: AppPreferences; // 全局配置
    sidebar: SidebarPreferences; // 侧边栏配置
    theme: ThemePreferences; // 主题配置
}