import type { Preferences } from '@/types/preferences'

// 默认偏好配置
export const defaultPreferences: Preferences = {
  // 全局配置
  app: {
    accessMode: 'frontend', // 权限模式
    defaultAvatar: 'https://unpkg.com/@vbenjs/static-source@0.1.7/source/avatar-v1.webp', // 应用默认头像
    watermark: false, // 是否开启水印
    name: 'ZS' // 项目标题
  },
  // 侧边栏配置
  sidebar: {
    collapsed: false, // 侧边栏是否折叠
    collapsedShowTitle: false, // 侧边栏折叠时，是否显示title
    expandOnHover: true, // 菜单自动展开状态
    width: 224 // 侧边栏宽度
  },
  // 主题配置
  theme: {
    builtinType: 'default', // 内置主题名称
    colorDestructive: 'hsl(348 100% 61%)', // 错误色
    colorPrimary: 'hsl(212 100% 45%)', // 主题色
    colorSuccess: 'hsl(144 57% 58%)', // 成功色
    colorWarning: 'hsl(42 84% 61%)', // 警告色
    mode: 'dark' // 当前主题,'auto' | 'dark' | 'light'
  }
}
