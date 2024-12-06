import { readonly, reactive, markRaw } from 'vue'
import type { Preferences } from '@/types/preferences'
import { defaultPreferences } from './config'
import { ls } from '@/utils/cache/storageCache'
import { deepMerge } from '@/utils/tools'
import { debounce } from 'lodash-es'
import { updateCSSVariables } from './updateCssVariables'
const STORAGE_KEY = 'preferences'

/**
 * class
 * 系统偏好设置管理
 * */
class PreferenceManager {
  private state: Preferences = reactive<Preferences>({
    ...this.loadPreferences()
  }) // 偏好配置数据
  private isInitialized: boolean = false // 是否已经初始化偏好配置
  private initialPreferences: Preferences = defaultPreferences // 这是初始化偏好配置，目的是为了，当重置偏好设置的时候用它
  private readonly savePreferences: (preference: Preferences) => void
  constructor () {
    // 避免频繁的操作缓存
    this.savePreferences = debounce(
      (preference: Preferences) => this._savePreferences(preference),
      150
    )
  }
  /**
   * 获取系统偏好设置
   * */
  getPreferences () {
    return readonly(this.state)
  }
  /**
   * 加载偏好设置
   */
  private loadPreferences (): Preferences {
    return this.loadCachedPreferences() || { ...defaultPreferences }
  }
  /**
   * 从缓存中加载偏好设置。如果缓存中没有找到对应的偏好设置，则返回默认偏好设置。
   */
  private loadCachedPreferences () {
    return ls.get<Preferences>(STORAGE_KEY)
  }
  /**
   * 初始化偏好设置
   * */
  initPreferences ({ overrides }: {overrides?: DeepPartial<Preferences>}) {
    // 是否初始化过
    if (this.isInitialized) {
      return
    }
    // 合并初始偏好设置，这就是初始化的配置了，不会再改了
    this.initialPreferences = deepMerge(defaultPreferences, overrides)

    // 加载并合并当前存储的偏好设置
    const mergedPreference: Preferences = deepMerge(this.initialPreferences, this.loadCachedPreferences() || {})
    // 更新偏好设置
    this.updatePreferences(mergedPreference)
  }
  /**
   * 更新偏好设置
   * @param updates - 要更新的偏好设置
   */
  updatePreferences (updates: DeepPartial<Preferences>) {
    // markRaw：将一个对象标记为不可被转为代理。返回该对象本身
    const mergedState = deepMerge(markRaw(this.state), updates)
    // 将最新的偏好配置和原来保存的偏好设置进行合并，得到最新的配置,this.state会变成最新的
    // Object.assign(target, ...sources),将sources中的属性值覆盖掉target中的属性值，最终target是一个合并之后最新的对象
    Object.assign(this.state, mergedState)

    // 根据最新的偏好配置去更新一些操作
    this.handleUpdates(updates)

    // 将最新的偏好配置存storage
    this.savePreferences(this.state)
  }
  /**
   * 重置偏好设置
   * */
  resetPreferences () {
    // 将状态重置为初始偏好设置，所以初始的数据会覆盖当前状态中的配置数据，this.state会更新
    Object.assign(this.state, this.initialPreferences)
    // 保存重置后的偏好设置存storage
    this.savePreferences(this.state);
    // 从存储中移除偏好设置项
    [STORAGE_KEY].forEach((key) => {
      ls.remove(key)
    })
    this.updatePreferences(this.state)
  }
  /**
   * 本地保存偏好设置
   */
  private _savePreferences (preference: Preferences) {
    ls.set(STORAGE_KEY, preference)
  }
  /**
   * 清空本地保存的偏好设置
   * */
  clearCache () {
    [STORAGE_KEY].forEach((key) => {
      ls.remove(key)
    })
  }
  /**
   * 处理更新的键值
   * 根据更新的键值执行相应的操作。
   * @param {DeepPartial<Preferences>} updates - 部分更新的偏好设置
   * 当需要更新部分配置的时候，但是配置的属性都是必填的情况下，可以先将配置变成可选
   */
  private handleUpdates (updates: DeepPartial<Preferences>) {
    
  }
}

const preferencesManager = new PreferenceManager()
export { preferencesManager }