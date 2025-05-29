import type { AxiosError, AxiosResponse } from 'axios'
import axios from 'axios'
import { isEmpty } from '@/utils/is'
import { toMd5 } from '@/utils/aes.ts'
import { ElMessage } from 'element-plus'

const service = axios.create({
  baseURL: 'https://test-gw.daokb.com',
  timeout: 1000 * 600, // 如果请求时间超过 `timeout` 的值，则请求会被中断
  headers: {
    'Content-Type': 'application/json'
  }
})

const timestamps = Date.now()

// 请求拦截
service.interceptors.request.use(
  // enc加密
  (config: any) => {
    const token = 'MGI4U3lNZjhQbEpJMXlsNjQvY01RQTBSbURYTUpLSUpnM29ITEYvMWRtME41Sk43N3MvTldOQ2ZsZEIzTzVUdA'
    let str
    const data = config.data || config.params
    // 签名
    const sign = toMd5(data, config.method, timestamps)
    if (!isEmpty(config.data) || !isEmpty(config.params)) {
      if (config.method === 'get') {
        for (const i in config.params) {
          config.params[i] = encodeURIComponent(config.params[i])
        }
      }
    } else {
      config.data = undefined
    }

    config.headers = {
      ...config.headers,
      token: token,
      sign: sign,
      timestamp: timestamps.toString()
    }

    /*
       * 因为axios中get会自动encodeURIComponent params参数
       * 空格等字符转换有出入 在公共initPage组件 将列表请求接口的参数拼接在 URL上
       * 所以这里需要将params清空
       *  */
    if (config.method === 'get' && config.url.indexOf('?') > -1) config.params = undefined
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// 响应拦截
service.interceptors.response.use(
  // 2xx时触发
  (response: AxiosResponse) => {
    // response.data就是后端返回的数据，结构根据你们的约定来定义
    // 响应解密
    if (response?.config?.responseType == 'blob') {
      return response
    } else {
      return response.data
    }
  },
  // 非2xx时触发
  (error: AxiosError) => {
    ElMessage.error('网络错误')
    return Promise.reject(error)
  }
)

export default service