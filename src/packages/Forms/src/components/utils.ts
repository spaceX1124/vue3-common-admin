import { isFunc, isString, isNullOrUndefOrEmpty } from '@/utils/is'
import { ref, unref } from 'vue'
import { http } from '@/utils/http'
import type { ISchema } from '@/adapter'

export function useOptions (schema: ISchema) {
  const showList = ref<Record<string, any>[]>([])
  // 控制接口请求只请求一次，如果需要每次都请求，就把它去掉
  const flag = ref(true)
  // 控制加载状态
  const loading = ref(false)
  /**
   * 处理数据
   * */
  function dealDataList (arr?: Record<string, any>[]) {
    const disabledOptions = schema.async?.disabledOptions
    const hiddenOptions = schema.async?.disabledOptions
    let hiddenOptionsSet
    if (isString(hiddenOptions)) {
      hiddenOptionsSet = new Set(hiddenOptions.split(','))
    }
    let disabledOptionsSet
    if (isString(disabledOptions)) {
      disabledOptionsSet = new Set(disabledOptions.split(','))
    }
    const label = schema?.async?.label || 'label'
    const value = schema?.async?.value || 'value'
    const listData: Record<string, any>[] = []
    if (arr?.length) {
      for (let i = 0; i < arr.length; i++) {
        // 判断是否需要隐藏一个或多个选项
        if (hiddenOptions) {
          // 是否隐藏当前选项，由外部业务去处理
          if (isFunc(hiddenOptions) && hiddenOptions(arr[i])) {
            // 跳过当前循环，执行下一个
            continue
          }
          if (hiddenOptionsSet) {
            if (hiddenOptionsSet.has(String(arr[i][value]))) {
              continue
            }
          }
        }
        // 判断是否禁用当前选项
        if (disabledOptions) {
          // 是否隐藏当前选项，由外部业务去处理
          if (isFunc(disabledOptions) && disabledOptions(arr[i])) {
            arr[i].disabled = true
          }
          if (disabledOptionsSet) {
            if (disabledOptionsSet.has(String(arr[i][value]))) {
              arr[i].disabled = true
            }
          }
        }
        listData.push({
          label: !isNullOrUndefOrEmpty(arr[i][label]) ? arr[i][label] : arr[i],
          value: !isNullOrUndefOrEmpty(arr[i][value]) ? arr[i][value].toString() : arr[i],
          disabled: arr[i].disabled || false,
          ...arr[i]
        })
      }
    }
    showList.value = listData
  }

  /**
   * 根据输入的关键词去搜索
   * */
  async function searchData (query?: string) {
    if (schema.async) {
      try {
        const { url, data, remoteKey, method } = schema.async
        const postData = { ...data }
        remoteKey && (postData[remoteKey] = query)
        loading.value = true
        const res: Record<string, any>[] = await http[method || 'get'](url, postData)
        loading.value = false
        // 处理数据格式
        dealDataList(res)
      } catch (err) {
        showList.value = []
      }
    }
  }
  /**
   * 直接搜索
   * */
  async function getOptionsList () {
    if (unref(flag) && schema.async && !schema.async.remote) {
      try {
        const { url, data, method } = schema.async
        loading.value = true
        const res: Record<string, any>[] = await http[method || 'get'](url, data)
        loading.value = false
        flag.value = false
        // 处理数据格式
        dealDataList(res)
      } catch (err) {
        showList.value = []
      }
    }
  }
  return {
    showList,
    loading,
    searchData,
    getOptionsList
  }
}
