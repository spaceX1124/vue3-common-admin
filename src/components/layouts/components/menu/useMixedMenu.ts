import { computed, type ComputedRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePermissionStore } from '@/stores/modules/permission'
import type { MenuRecordRaw } from '@/packages/ui/menus'
export function useMixedMenu () {
  const route = useRoute()
  const router = useRouter()
  const permissionStore = usePermissionStore()
  // 从store中，拿到权限范围内的菜单数据
  const sidebarMenus:ComputedRef<MenuRecordRaw[]> = computed(() => permissionStore.accessMenus)

  // 当前激活的菜单
  const sidebarActive = computed(() => {
    return route.path
  })

  // 点击菜单事件处理
  const handleMenuSelect = async (key: string) => {
    await router.push({
      path: key
    })
  }
  return {
    sidebarMenus,
    sidebarActive,
    handleMenuSelect
  }
}
