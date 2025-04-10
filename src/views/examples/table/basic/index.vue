<template>
  <Page auto-content-height>
    <Table/>
  </Page>
</template>
<script lang="tsx" setup>
import Page from '@/components/Page/index.vue'
import { useTable } from '@/packages/VxeTable'

const [Table] = useTable({
  schema: [
    {
      fieldKey: 'key1',
      component: 'Input',
      fieldName: '姓名',
      componentProps: {
        placeholder: '无限制'
      },
      required: true
    },
    {
      fieldKey: 'key0',
      component: 'Input',
      fieldName: '年龄',
      componentProps: {
        placeholder: '无限制'
      },
      required: true
    },
    {
      fieldKey: 'hobby',
      component: 'Select',
      fieldName: '爱好',
      componentProps: {
        options: [
          {
            label: '篮球',
            value: 1
          },
          {
            label: '足球',
            value: 2
          }
        ]
      },
      required: true,
      isEcho: true
    },
    {
      fieldKey: 'hobby1',
      component: 'ApiSelect',
      fieldName: '异步爱好1',
      required: true,
      async: {
        // 需要异步数据
        url: '/api/hobbyList', // 接口地址
        method: 'post', // 请求方法
        label: 'title', // list对应的label取对应的字段
        value: 'id', // list对应的value取对应的字段
        data: { type: 1 }
      },
      componentEvent: {
        focus: (e: any) => {
          console.log(e, 'focus')
        }
      },
      cellRenderer: (obj) => {
        // 渲染加载一次，表头数据变更加载一次，所以，10条加载了20次
        return <div>666</div>
      }
    },
    {
      fieldKey: 'hobby2',
      component: 'ApiSelect',
      fieldName: '异步爱好2',
      required: true,
      async: {
        // 需要异步数据
        url: '/api/hobbyList', // 接口地址
        method: 'post', // 请求方法
        label: 'title', // list对应的label取对应的字段
        value: 'id', // list对应的value取对应的字段
        data: { type: 1 }
      },
      componentEvent: {
        focus: (e: any) => {
          console.log(e, 'focus')
        }
      },
      isEcho: true
    }
  ],
  listApi: {
    url: '/api/pageList',
    method: 'post'
  },
  height: 'auto'
})

// @todo，处理一下页面的样式和滚动条，分页
</script>