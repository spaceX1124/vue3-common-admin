<template>
  <li
    :class="[
      b(),
      is('active', active)
    ]"
    @click.stop="handleClick">
    <Tooltip
      v-if="showTooltip"
      side="right"
    >
      <template #trigger>
        <div :class="[nsMenu.b('tooltip__trigger')]">
          <Icons :class="nsMenu.e('icon')" :icon="icon" fallback />
          <slot/>
        </div>
      </template>
      <slot name="title"/>
    </Tooltip>
    <div v-show="!showTooltip" :class="[e('content')]">
      <Icons :icon="icon" :class="nsMenu.e('icon')"/>
      <slot name="title"/>
    </div>
  </li>
</template>
<script setup lang="ts">
import type { MenuItemProps, MenuItemRegistered } from '../type'
import { useMenuContext, useSubMenuContext } from '../hooks/useMenuContext'
import { useMenu } from '../hooks/useMenu'
import { useNamespace } from '@/packages/utils/composables/useNameSpace'
import { computed, onMounted, onBeforeUnmount, reactive, useSlots } from 'vue'
import { Icons } from '@/packages/Icons'
import { Tooltip } from '@/packages/Tooltip'

// MenuItem接收的参数
interface PropsType extends MenuItemProps {}
const props = withDefaults(defineProps<PropsType>(), {})

const emit = defineEmits<{ click: [MenuItemRegistered] }>()
// 设置组件的名称
defineOptions({ name: 'MenuItem' })

// 遵循BEM规范
const { is, b, e } = useNamespace('menu-item')
const nsMenu = useNamespace('menu')

// 获取最外层Menu组件注入的数据
const rootMenu = useMenuContext()

// 获取当前MenuItem组件的上级SubMenu组件提供的数据
const subMenu = useSubMenuContext()

// 获取当前菜单项及父级链路，找到当前组件实例的父级实例
const { parentPaths, parentMenu } = useMenu()

// 当前菜单项是否是active的, rootMenu?.activePath是当前选中的菜单的path
const active = computed(() => {
  return props.path === rootMenu?.activePath
})

// 如果当前实例的父级实例name为Menu，即最外层，./Menu.vue这个组件
const isTopLevelMenuItem = computed(
  () => parentMenu.value?.type.name === 'MenuShow'
)
const slots = useSlots()
// 最外层菜单，没有子菜单的情况下，又是折叠的，就展示
const showTooltip = computed(() => (
  isTopLevelMenuItem.value &&
    rootMenu.props?.collapse &&
    slots.title)
)

/**
 * 菜单项点击事件
 */
function handleClick () {
  // 执行父级提供的点击菜单项事件
  rootMenu?.handleMenuItemClick?.({
    parentPaths: parentPaths.value,
    path: props.path
  })
  emit('click', item)
}
const item: MenuItemRegistered = reactive({
  active,
  parentPaths: parentPaths.value,
  path: props.path || ''
})

onMounted(() => {
  subMenu?.addSubMenu?.(item)
  rootMenu?.addMenuItem?.(item)
})

onBeforeUnmount(() => {
  subMenu?.removeSubMenu?.(item)
  rootMenu?.removeMenuItem?.(item)
})
</script>
