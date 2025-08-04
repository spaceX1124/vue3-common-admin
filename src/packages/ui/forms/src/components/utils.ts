import { isFunc, isString, isNullOrUndefOrEmpty } from '@/packages/utils/is'
import { type ComputedRef, ref, unref } from 'vue'
import { http } from '@/packages/utils/http'
import type { IAsync } from '@/adapter'

export function useOptions (async: ComputedRef<Partial<IAsync>>) {
  // 要展示的选项数据
  const showList = ref<Record<string, any>[]>([])
  // 控制加载状态
  const loading = ref(false)
  /**
   * 处理数据
   * */
  function dealDataList (arr?: Record<string, any>[]) {
    // 禁用选项
    const disabledOptions = async?.value?.disabledOptions
    // 隐藏选项
    const hiddenOptions = async?.value?.hiddenOptions
    let hiddenOptionsSet
    if (isString(hiddenOptions)) {
      hiddenOptionsSet = new Set(hiddenOptions.split(','))
    }
    let disabledOptionsSet
    if (isString(disabledOptions)) {
      disabledOptionsSet = new Set(disabledOptions.split(','))
    }

    const label = async?.value?.label || 'label'
    const value = async?.value?.value || 'value'
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
          // 是否禁用当前选项，由外部业务去处理
          if (isFunc(disabledOptions)) {
            arr[i].disabled = disabledOptions(arr[i])
          }
          if (disabledOptionsSet) {
            arr[i].disabled = disabledOptionsSet.has(String(arr[i][value]))
          }
        }
        listData.push({
          ...arr[i],
          label: !isNullOrUndefOrEmpty(arr[i][label]) ? arr[i][label] : arr[i],
          value: !isNullOrUndefOrEmpty(arr[i][value]) ? arr[i][value].toString() : arr[i],
          disabled: arr[i].disabled || false
        })
      }
    }
    showList.value = listData
  }

  /**
   * 根据输入的关键词去搜索
   * */
  async function remoteApiData (query?: string) {
    if (!query) {
      showList.value = []
      return
    }
    if (async?.value) {
      try {
        const { url, data, remoteKey, method } = async.value
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

  async function getApiList () {
    if (async?.value) {
      try {
        const { url, data, method } = async.value
        loading.value = true
        const res: Record<string, any>[] = await http[method || 'get'](url, data)
        loading.value = false
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
    remoteApiData,
    dealDataList,
    getApiList
  }
}
