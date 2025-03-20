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
