<template>
  <li 
    class="sub-menu"
    :class="{'is-active': active, 'is-opened': opened}"
    @focus="handleMouseenter"
    @mouseenter="handleMouseenter"
    @mouseleave="() => handleMouseleave()"
  >

    <template v-if="rootMenu.isMenuPopup">
      <HoverCard
        :content-class="[
          opened ? '' : 'hidden',
          'menu__popup-container'
        ]"
        :content-props="contentProps"
        :open="true"
        :open-delay="0"
      >
        <template #trigger>
          <SubMenuContent
            :class="{'is-active': active}"
            :icon="icon"
            :level="currentLevel"
            :path="path"
            @click.stop="handleClick"
          >
            <template #title>
              <slot name="title"/>
            </template>
          </SubMenuContent>
        </template>
        <div
          class="menu__popup"
          @focus="(e) => handleMouseenter(e, 100)"
          @mouseenter="(e) => handleMouseenter(e, 100)"
          @mouseleave="() => handleMouseleave(true)">
          <ul
            class="menu"
            :class="{'is-rounded':rounded }"
            :style="subMenuStyle"
          >
            <slot/>
          </ul>
        </div>
      </HoverCard>
    </template>
    <template v-else>
      <SubMenuContent
        :class="{'is-active': active}"
        @click.stop="handleClick"
        :icon="icon"
        :path="path"
        :level="currentLevel">
        <slot name="content"/>
        <template #title>
          <slot name="title"/>
        </template>
      </SubMenuContent>
      <CollapseTransition>
        <ul v-show="opened" class="menu" :class="{'is-rounded': rounded}" :style="subMenuStyle">
          <slot/>
        </ul>
      </CollapseTransition>
    </template>
  </li>
</template>
<script setup lang="ts">
import CollapseTransition from './collapse-transition.vue'
import SubMenuContent from './SubMenuContent.vue'
import { computed, ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { useMenuContext, createSubMenuContext, useSubMenuContext } from '../hooks/useMenuContext'
import type { SubMenuProps, MenuProvider, MenuItemRegistered } from '../type'
import { useNamespace } from '@/packages/utils/composables/useNameSpace'
import { useMenu, useMenuStyle } from '../hooks/useMenu'
import { HoverCard, type HoverCardContentProps } from '@/packages/ui/hover-card'

interface PropsType extends SubMenuProps {}
const props = withDefaults(defineProps<PropsType>(), {})
defineOptions({ name: 'SubMenu' })

// 当前SubMenu组件保存的所有后代MenuItem数据
const subMenus = ref<MenuProvider['subMenus']>({})

const mouseInChild = ref(false)

// 获取最外层Menu组件注入的数据
const rootMenu = useMenuContext()

// 获取当前SubMenu组件的上层SubMenu组件注入的数据
const subMenu = useSubMenuContext()
// 给ul设置等级--menu-level变量
const subMenuStyle = useMenuStyle(subMenu)

// 获取当前菜单项及父级链路,和当前实例的父级实例
const { parentPaths, parentMenu } = useMenu()

// 当前SubMenu的path是否在展开菜单数据openedMenus中
const opened = computed(() => {
  return rootMenu?.openedMenus.includes(props.path)
})

// 当前suMenu的level
const currentLevel = computed(() => subMenu?.level ?? 0)

// 是否为圆角
const rounded = computed(() => rootMenu?.props.rounded)

// 只要当前SubMenu保存的所有后代数据subMenus中有active为true的，那么这个SubMenu就是打开的
const active = computed(() => {
  let isActive = false
  Object.values(subMenus.value).forEach((subItem) => {
    if (subItem.active) {
      isActive = true
    }
  })
  return isActive
})

const contentProps = computed((): HoverCardContentProps => {
  return {
    collisionPadding: { top: 20 },
    side: 'right',
    sideOffset: 10
  }
})

// 为当前SubMenu逐渐的后代提供数据
createSubMenuContext({
  addSubMenu,
  handleMouseleave,
  level: (subMenu?.level ?? 0) + 1, // 前者为null或者undefined就取后者
  mouseInChild,
  removeSubMenu
})

function addSubMenu (subMenu: MenuItemRegistered) {
  subMenus.value[subMenu.path] = subMenu
}

function removeSubMenu (subMenu: MenuItemRegistered) {
  Reflect.deleteProperty(subMenus.value, subMenu.path)
}

/**
 * 点击submenu展开/关闭
 */
function handleClick () {
  if (rootMenu?.props.collapse) return
  rootMenu?.handleSubMenuClick({
    active: active.value, // 当前subMenu是否展开
    parentPaths: parentPaths.value,
    path: props.path
  })
}
const item = reactive({
  active,
  parentPaths,
  path: props.path
})

onMounted(() => {
  // 将重新组装的SubMenu项数据存起来
  subMenu?.addSubMenu?.(item)
  rootMenu?.addSubMenu?.(item)
})

onBeforeUnmount(() => {
  subMenu?.removeSubMenu?.(item)
  rootMenu?.removeSubMenu?.(item)
})

const timer = ref<null | ReturnType<typeof setTimeout>>(null)
/**
 * 鼠标移入展开hover，显示子菜单中的菜单项
 * */
function handleMouseenter (event: FocusEvent | MouseEvent, showTimeout = 300) {
  if (event.type === 'focus') {
    return
  }

  if (!rootMenu?.props.collapse) {
    if (subMenu) {
      subMenu.mouseInChild.value = true
    }
    return
  }
  if (subMenu) {
    subMenu.mouseInChild.value = true
  }
  timer.value && window.clearTimeout(timer.value)
  // 300ms之后打开Hover
  timer.value = setTimeout(() => {
    // 点击展开菜单
    rootMenu?.openMenu(props.path, parentPaths.value)
  }, showTimeout)
}

function handleMouseleave (deepDispatch = false) {
  if (
    !rootMenu?.props.collapse &&
      subMenu
  ) {
    subMenu.mouseInChild.value = false
    return
  }

  timer.value && window.clearTimeout(timer.value)

  if (subMenu) {
    subMenu.mouseInChild.value = false
  }
  timer.value = setTimeout(() => {
    !mouseInChild.value && rootMenu?.closeMenu(props.path, parentPaths.value)
  }, 300)
  // 这儿处理的目的是，如鼠标离开三级菜单的时候，二级菜单也消失，也就是处理当前鼠标移出时执行上级菜单的移出
  if (deepDispatch) {
    subMenu?.handleMouseleave?.(true)
  }
}
</script>
