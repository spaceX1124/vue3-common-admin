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
            path: '/examples/form/input',
            name: 'ExamplesFormInput',
            component: () => import('@/views/examples/form/input/index.vue'),
            meta: {
              title: '输入框'
            }
          },
          {
            path: '/examples/form/select',
            name: 'ExamplesFormSelect',
            component: () => import('@/views/examples/form/select/index.vue'),
            meta: {
              title: '下拉框'
            }
          },
          {
            path: '/examples/form/checkbox',
            name: 'ExamplesFormCheckbox',
            component: () => import('@/views/examples/form/checkbox/index.vue'), meta: {
              title: '复选框'
            }
          },
          {
            path: '/examples/form/radio',
            name: 'ExamplesFormRadio',
            component: () => import('@/views/examples/form/radio/index.vue'), meta: {
              title: '单选框'
            }
          },
          {
            path: '/examples/form/date',
            name: 'ExamplesFormDate',
            component: () => import('@/views/examples/form/date/index.vue'), meta: {
              title: '日期'
            }
          },
          {
            path: '/examples/form/intervalInput',
            name: 'ExamplesFormIntervalInput',
            component: () => import('@/views/examples/form/intervalInput/index.vue'), meta: {
              title: '区间输入'
            }
          },
          {
            path: '/examples/form/query',
            name: 'ExamplesFormQuery',
            component: () => import('@/views/examples/form/query/index.vue'), meta: {
              title: '渠道测试'
            }
          }
        ]
      },
      {
        path: '/examples/table',
        name: 'ExamplesTable',
        redirect: '/examples/table/basic',
        meta: {
          title: '表格'
        },
        children: [
          {
            path: '/examples/table/basic',
            name: 'ExamplesTableBasic',
            component: () => import('@/views/examples/table/basic/index.vue'),
            meta: {
              title: '机构画像审核'
            }
          },
          {
            path: '/examples/table/channelList',
            name: 'ExamplesTableChannelList',
            component: () => import('@/views/examples/table/channelList/index.vue'),
            meta: {
              title: '渠道列表'
            }
          },
          {
            path: '/examples/table/channelDataStatics',
            name: 'ExamplesTableChannelDataStatics',
            component: () => import('@/views/examples/table/channelDataStatics/index.vue'),
            meta: {
              title: '渠道数据统计'
            }
          }
        ]
      }
    ]
  }
]

export default routes
