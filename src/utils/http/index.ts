import { type AxiosRequestConfig, type AxiosResponse } from 'axios'
import service from './axios'
import type { Result } from './type'
import { ossPath } from './api.ts'
import { ls } from '@/utils/cache/storageCache.ts'
import { cacheUserInfo } from '@/libs/constants.ts'
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

function getOssUrl (url: string) {
  if (!url) return ''
  if (/^https?:\/\//i.test(url)) return url
  const formattedUrl = url.startsWith('/') ? url.substring(1) : url
  return ossPath + '/cms/proxy/' + formattedUrl + '?token=' + ls.get<{token: string}>(cacheUserInfo)?.token || ''
}

export {
  http,
  getOssUrl
}
