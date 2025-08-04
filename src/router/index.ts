import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { createRouterGuard } from './guard'
import Layouts from '@/components/layouts/Layouts.vue'

const basicRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Root',
    component: Layouts,
    meta: {
      title: 'Root'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/:path(.*)*',
    name: 'NotFound',
    component: () => import('@/views/fallback/notFound/index.vue'),
    meta: {
      title: '404'
    }
  }
]

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
