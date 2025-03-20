import { type AxiosRequestConfig, type AxiosResponse } from 'axios'
import service from './axios'
import type { Result } from './type'
const http: Record<string, PromiseFn> = {
  get (url: string, params?: Record<string, any>, config?: AxiosRequestConfig) {
    return request({ url, params, ...config, method: 'get' })
  },
  post (url: string, data?: Record<string, any>, config?: AxiosRequestConfig) {
    return request({ url, data, ...config, method: 'post' })
  }
}

function request (config: AxiosRequestConfig): Promise<any> {
  return new Promise((resolve, reject) => {
    service
    .request(config)
    .then((res: AxiosResponse<Result>) => {
      resolve(res.data)
    })
    .catch(reject)
  })
}

export {
  http
}
