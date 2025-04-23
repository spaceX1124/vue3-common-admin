import type { RouteRecordRaw } from 'vue-router'
const Layouts = () => import('@/components/layouts/Layouts.vue')

const routes: RouteRecordRaw[] = [
  {
    path: '/examples',
    name: 'Examples',
    component: Layouts,
    redirect: '/examples/form',
    meta: {
      title: '示例'
    },
    children: [
      {
        path: '/examples/form',
        name: 'FormExample',
        redirect: '/examples/form/basic',
        meta: {
          title: '表单'
        },
        children: [
          {
            path: '/examples/form/basic',
            name: 'FormBasicExample',
            component: () => import('@/views/examples/form/basic/index.vue'),
            meta: {
              title: '基础表单'
            }
          },
          {
            path: '/examples/form/rules',
            name: 'FormRulesExample',
            component: () => import('@/views/examples/form/rules/index.vue'),
            meta: {
              title: '校验表单'
            }
          },
          {
            path: '/examples/form/query',
            name: 'FormQueryExample',
            component: () => import('@/views/examples/form/query/index.vue'), meta: {
              title: '查询表单'
            }

          }
        ]
      }
    ]
  }
]

export default routes
