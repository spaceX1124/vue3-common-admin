import { createRouter, createWebHistory } from 'vue-router'
import { createRouterGuard } from './guard'
import { basicRoutes } from './routes'

/**
 * 创建路由实例
 * */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: basicRoutes
})

/**
 * 创建路由拦截
 * */
createRouterGuard(router)
export default router

// 容器路由不用定义component
