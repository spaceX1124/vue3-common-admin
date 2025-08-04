import Mock from 'mockjs'

// 随机方法
const Random = Mock.Random
// 延时200-600毫秒请求到数据
Mock.setup({
  timeout: '300'
})
Mock.mock('/api/pageList', 'post', (data: any) => {
  // 定义这个接口的总数
  const total = 372
  const postData = JSON.parse(data.body)
  // 向上取整，一页10条->4页，一页20条->2页，一页30条->2页，一页40条->1页
  const pages = Math.ceil(total / postData.pageSize)
  // 取余，一页10条->7，一页20条->17，一页30条->7，一页40条->37
  const remainder = total % postData.pageSize
  const loopNum = postData.pageNum < pages ? postData.pageSize : remainder
  // 'data|10',我不知道怎么写这个变量，只能通过if判断了
  const { list } = Mock.mock({
    [`list|${loopNum}`]: [
      {
        'id|+1': 1 + (postData.pageNum - 1) * postData.pageSize,
        key0: '@integer(10, 100)', // 年龄
        key1: '@cname()', // 姓名
        key2: '@integer(0, 2)', // 性别
        key3: '@integer(1, 3)', // 爱好单选
        key4: '@date()', // 创建日期
        key5: function () {
          return Random.cparagraph(9, 12)
        }, // 备注
        key6: function () {
          return Random.cparagraph(9, 12)
        }, // 备注
        key7: '1,2,3', // 爱好多选
        key8: [1, 2, 3], // 爱好多选
        key9: function () {
          // 生成一个带中文人名的图片
          return Random.image('100x400', Random.color()) + '&text=' + encodeURIComponent('张三')
        },
        key10: function () {
          // 生成一个带中文人名的图片
          return [
            Random.image('200x400', Random.color()) + '&text=' + encodeURIComponent('张三11'),
            Random.image('200x400', Random.color()) + '&text=' + encodeURIComponent('张三22')
          ]
        },
        hobby: 1,
        hobby1: 2,
        hobby2: 3
      }
    ]
  })
  // 处理排序
  if (postData.sortData) {
    list.sort((a: any, b: any) => {
      if (postData.sortData.order === 'asc') {
        return a[postData.sortData.field] - b[postData.sortData.field]
      }
      if (postData.sortData.order === 'desc') {
        return b[postData.sortData.field] - a[postData.sortData.field]
      }
    })
  }
  return {
    code: 0,
    data: {
      current: postData.pageNum,
      pages,
      size: postData.pageSize,
      records: list,
      total
    },
    message: '调用成功',
    ok: true,
    result: 'success'
  }
})

Mock.mock('/api/hobbyList', 'post', (data:any) => {
  const postData = JSON.parse(data.body)
  return {
    code: 0,
    data: [
      { title: '篮球', id: 1, remark: '我爱打篮球' },
      { title: '足球', id: 2, remark: '我爱打足球' },
      { title: '乒乓球', id: 3, remark: '我爱打乒乓球' }
    ],
    message: '调用成功',
    ok: true,
    result: 'success'
  }
})

Mock.mock('/api/getMenuList', 'post', (data:any) => {
  const postData = JSON.parse(data.body)
  return {
    code: 0,
    data: [
      {
        path: '/examples',
        title: '示例',
        name: 'Examples',
        order: 2,
        icon: 'lucide:layout-dashboard',
        children: [
          {
            path: '/examples/form',
            title: '表单',
            name: 'ExamplesForm',
            order: 1,
            icon: 'lucide:layout-dashboard',
            children: [
              {
                path: '/examples/form/input',
                name: 'ExamplesFormInput',
                title: '输入框',
                icon: 'lucide:layout-dashboard',
                order: 1
              },
              {
                path: '/examples/form/select',
                name: 'ExamplesFormSelect',
                title: '下拉框',
                icon: 'lucide:layout-dashboard',
                order: 2
              },
              {
                path: '/examples/form/checkbox',
                name: 'ExamplesFormCheckbox',
                title: '复选框',
                icon: 'lucide:layout-dashboard',
                order: 3
              },
              {
                path: '/examples/form/radio',
                name: 'ExamplesFormRadio',
                title: '单选框',
                icon: 'lucide:layout-dashboard',
                order: 4
              },
              {
                path: '/examples/form/intervalInput',
                name: 'ExamplesFormIntervalInput',
                title: '区间输入',
                icon: 'lucide:layout-dashboard',
                order: 5
              },
              {
                path: '/examples/form/date',
                name: 'ExamplesFormDate',
                title: '日期',
                icon: 'lucide:layout-dashboard',
                order: 6
              },
              {
                path: '/examples/form/query',
                name: 'ExamplesFormQuery',
                title: '搜索表单',
                icon: 'lucide:layout-dashboard',
                order: 7
              }
            ]
          },
          {
            path: '/examples/table',
            title: '表格',
            name: 'ExamplesTable',
            order: 1,
            icon: 'lucide:layout-dashboard',
            children: [
              {
                path: '/examples/table/basic',
                name: 'ExamplesTableBasic',
                title: '基础表格',
                icon: 'lucide:layout-dashboard',
                order: 1
              }
            ]
          }
        ]
      }, {
        path: '/home',
        title: 'Home',
        name: 'Home',
        order: 1,
        icon: 'lucide:layout-dashboard'
      }
    ],
    message: '调用成功',
    ok: true,
    result: 'success'
  }
})

// 基础表格数据模拟
Mock.mock('/api/table/basic/list', 'post', (data:any) => {
  console.log(data, 'data22')
  // 定义这个接口的总数
  const total = 37
  const postData = JSON.parse(data.body)
  // 37 / 10 = 3.7 => 4页数据
  // 向上取整，一页10条->4页，一页20条->2页，一页30条->2页，一页40条->1页
  const pages = Math.ceil(total / postData.size)
  // 取余，一页10条->7，一页20条->17，一页30条->7，一页40条->37
  const remainder = total % postData.size
  const loopNum = postData.page < pages ? postData.size : remainder
  // 'data|10',我不知道怎么写这个变量，只能通过if判断了
  const { list } = Mock.mock({
    [`list|${loopNum}`]: [
      {
        'id|+1': 1 + (postData.page - 1) * postData.size,
        key0: '@integer(10, 100)' // 年龄
      }
    ]
  })
  return {
    code: 0,
    data: {
      current: postData.page, // 当前是第几页
      pages, // 一共有多少页
      size: postData.size, // 一页展示多少条
      records: list, // 当前页的数据
      total // 一共有多少条数据
    },
    message: '调用成功',
    ok: true,
    result: 'success'
  }
})