import { watch, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTabBarStore } from '@/stores/modules/tabbar'
import type { RouteLocationNormalizedGeneric } from 'vue-router'

export function useTabBar () {
  const route = useRoute()
  const router = useRouter()
  const tabBarStore = useTabBarStore()

  // 当前选中的tab
  const currentActive = computed(() => {
    // 完整路径，包括params和query参数
    return route.fullPath
  })

  watch(() => route.path, () => {
    tabBarStore.addTab({ ...route })
  }, { immediate: true })

  const currentTabs = ref<RouteLocationNormalizedGeneric[]>()
  watch(
    [
      () => tabBarStore.getTabs,
      () => tabBarStore.updateTime
    ],
    ([tabs]) => {
      currentTabs.value = tabs
    }, { immediate: true }
  )

  // 点击tab,跳转路由
  const handleClick = async (key: string) => {
    await router.push(key)
  }
  // 关闭tab
  const handleClose = async (key: string) => {
    await tabBarStore.closeTabByKey(key, router)
  }

  return {
    currentTabs,
    currentActive,
    handleClick,
    handleClose
  }
}