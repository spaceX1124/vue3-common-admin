import { isNullOrUnDef } from '@/packages/utils/is'
import { isProd } from '@/packages/utils/env'
import { Aes } from '@/packages/utils/aes'
import { DEFAULT_NAMESPACE } from '@/libs/constants'

interface StorageParams {
    storage: Storage; // localStorage | sessionStorage
    preKey?: string; // 前缀
    isAes?: boolean; // 是否加密
    timeout?: number; // 超时时间（秒）
}

interface StorageItem<T> {
  value: T;
  time: number;
  expire: number | null;
}

const prefix = DEFAULT_NAMESPACE + '__'
const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7
/**
 * 创建storage实例对象
 * */
function createStorage (params: StorageParams) {
  const {
    storage,
    preKey = prefix,
    timeout = DEFAULT_CACHE_TIME,
    isAes = false
  } = params
  // WebStorage类
  class WebStorage {
    public storage: Storage
    public preKey: string
    readonly isAes: boolean
    constructor () {
      this.storage = storage
      this.preKey = preKey
      this.isAes = isAes
    }
    getKey (key: string) {
      return `${this.preKey}${key}`.toUpperCase()
    }
    set<T> (key: string, value: T, expire?: number) {
      const data: StorageItem<T> = {
        value,
        time: Date.now(),
        expire: !isNullOrUnDef(expire) ? new Date().getTime() + expire * 1000 : null
      }
      const stringData = JSON.stringify(data)
      const aesData = this.isAes ? Aes.encrypt(stringData) : stringData
      this.storage.setItem(this.getKey(key), aesData)
    }
    get<T = any> (key: string, def: null | T = null): null | T {
      const val = this.storage.getItem(this.getKey(key))
      if(!val) return def
      try {
        const aceVal = this.isAes ? Aes.decrypt(val) : val
        const data: StorageItem<T> = JSON.parse(aceVal)
        const { value, expire } = data
        // expire 为null，或者大于当前时间则返回数据
        if (isNullOrUnDef(expire) || expire >= new Date().getTime()) {
          return value
        } else {
          // 删除当前缓存
          this.remove(key)
          return def
        }
      }catch (e) {
        return def
      }
    }
    remove (key: string) {
      this.storage.removeItem(this.getKey(key))
    }

  }
  return new WebStorage()
}

const ls = createStorage({ storage: localStorage, isAes: isProd() })
const ss = createStorage({ storage: sessionStorage, isAes: isProd() })
export {
  ls,
  ss
}
