import type { Preferences } from '@/types/preferences'

// 默认偏好配置
export const defaultPreferences: Preferences = {
  // 全局配置
  app: {
    accessMode: 'backend', // 权限模式
    defaultAvatar: 'https://unpkg.com/@vbenjs/static-source@0.1.7/source/avatar-v1.webp', // 应用默认头像
    watermark: false, // 是否开启水印
    name: 'ZS', // 项目标题
    isMobile: false // 是否移动端
  },
  // 侧边栏配置
  sidebar: {
    collapsed: false, // 侧边栏是否折叠
    collapsedShowTitle: false, // 侧边栏折叠时，是否显示title
    expandOnHover: true, // 菜单自动展开状态
    width: 210, // 侧边栏宽度
    hidden: false // 侧边栏是否隐藏
  },
  // header配置
  header: {
    height: 50 // header高度
  }
}
