import axios from 'axios'

const service = axios.create({
  baseURL: '',
  timeout: 1000 * 600, // 如果请求时间超过 `timeout` 的值，则请求会被中断
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截
service.interceptors.request.use((config: any) => {
  config.headers = {
    ...config.headers
  }
  return config
})
// 响应拦截
service.interceptors.response.use((response) => {
  return response.data
})

export default service