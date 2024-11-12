<template>
  <ul :class="[
        theme,
        b(),
        is(mode, true),
        is(theme, true),
        is('rounded', rounded),
      ]"
      :style="menuStyle"
  >
    <slot/>
  </ul>
</template>
<script lang="ts" setup>
import type { MenuProps, MenuItemClicked, MenuProvider, SubMenuClicked, MenuItemRegistered } from '@/types/menu'
import { createMenuContext, createSubMenuContext } from '../hooks/useMenuContext'
import { useMenuStyle } from '../hooks/useMenu'
import { reactive, toRef, ref } from 'vue'
import { isHttpUrl } from '@/utils/is'
import { useNamespace } from '@/utils/composables/useNameSpace'
interface PropsType extends MenuProps {}

const props = withDefaults(defineProps<PropsType>(), {
  collapse: false, // 菜单是否折叠，默认值
  mode: 'vertical', // 菜单模式，默认值
  theme: 'light', // 菜单主题，默认值
  rounded: true // 显示圆角
})
// 对组件进行命名
defineOptions({ name: 'MenuShow' })

// 遵循BEM规范
const { b, is } = useNamespace('menu')

// 这种对事件进行类型标注的方式——学习了
const emit = defineEmits<{
  select: [string, string[]];
  open: [string, string[]];
  close: [string, string[]];
}>()

// 当前选中菜单路径
const activePath = ref<MenuProvider['activePath']>(props.defaultActive)
// 当前展开的 SubMenu 菜单项,如展开一级SubMenu,则为['/demo']，如展开二级SubMenu，则为['/demo', '/demo/example']
const openedMenus = ref<MenuProvider['openedMenus']>(
  // 默认展开项，没有折叠，取默认展开项
  props.defaultOpends && !props.collapse ? [...props.defaultOpends] : []
)

const menuStyle = useMenuStyle()

// 获取当前选中菜单的父级链路
function getActivePaths () {
  const activeItem = activePath.value && items.value[activePath.value]
  if (!activeItem || props.mode === 'horizontal' || props.collapse) {
    return []
  }
  return activeItem.parentPaths
}
/**
 * 点击MenuItem菜单项
 * */
function handleMenuItemClick (data: MenuItemClicked) {
  const { parentPaths, path } = data
  if (!path || !parentPaths) {
    return
  }
  // 如果path不是http的
  if (!isHttpUrl(path)) {
    // 设置当前选中菜单路径
    activePath.value = path
  }
  emit('select', path, parentPaths)
}

/**
 * 点击SubMenu菜单项
 * */
function handleSubMenuClick ({ parentPaths, path }: SubMenuClicked) {
  const isOpened = openedMenus.value.includes(path)
  if (isOpened) {
    // 关闭SubMenu
    closeMenu(path, parentPaths)
  } else {
    // 打开SubMenu
    openMenu(path, parentPaths)
  }
}
/**
 * 点击展开菜单
 */
function openMenu (path: string, parentPaths: string[]) {
  if (openedMenus.value.includes(path)) {
    return
  }
  // 手风琴模式菜单
  if (props.accordion) {
    const activeParentPaths = getActivePaths()
    if (activeParentPaths.includes(path)) {
      parentPaths = activeParentPaths
    }
    openedMenus.value = openedMenus.value.filter((path: string) =>
      parentPaths.includes(path)
    )
  }
  // 将当前SubMenu的path放进去
  openedMenus.value.push(path)
  emit('open', path, parentPaths)
}
/**
 * 关闭、折叠菜单
 */
function closeMenu (path: string, parentPaths: string[]) {
  if (props.accordion) {
    openedMenus.value = subMenus.value[path]?.parentPaths ?? []
  }
  // 将当前path从openedMenus中删除
  close(path)
  emit('close', path, parentPaths)
}

/**
 * 从openedMenus中删除当前path
 * */
function close (path: string) {
  const i = openedMenus.value.indexOf(path)
  if (i !== -1) {
    openedMenus.value.splice(i, 1)
  }
}

// 所有MenuItem对应的MenuItemRegistered数据都存这里
const items = ref<MenuProvider['items']>({})

// 所有SubMenu对应的MenuItemRegistered数据都存这里
const subMenus = ref<MenuProvider['subMenus']>({})

/**
 * 为items注入每个MenuItem的数据MenuItemRegistered
 * */
function addMenuItem (item: MenuItemRegistered) {
  items.value[item.path] = item
}
/**
 * 为subMenus注入每个SubMenu的数据MenuItemRegistered
 * */
function addSubMenu (subMenu: MenuItemRegistered) {
  subMenus.value[subMenu.path] = subMenu
}
/**
 * 移除对应的items
 * */
function removeMenuItem (item: MenuItemRegistered) {
  Reflect.deleteProperty(items.value, item.path)
}
/**
 * 移除对应的subMenus
 * */
function removeSubMenu (subMenu: MenuItemRegistered) {
  Reflect.deleteProperty(subMenus.value, subMenu.path)
}

// 注入上下文
createMenuContext(
  reactive({
    activePath,
    theme: toRef(props, 'theme'), // 将props中的theme转成ref响应式，当主题色修改的时候，下层组件响应式刷新
    handleMenuItemClick,
    handleSubMenuClick,
    openedMenus,
    items,
    subMenus,
    addMenuItem,
    addSubMenu,
    removeSubMenu,
    removeMenuItem,
    props
  }))
const mouseInChild = ref(false)
createSubMenuContext({
  addSubMenu,
  level: 1,
  mouseInChild,
  removeSubMenu
})

</script>

<style lang="scss">
$namespace: zs;
.#{$namespace}-menu {
  --menu-item-height: 38px;
  --menu-font-size: 14px;
  --menu-item-radius: 0px;
  --menu-item-margin-x: 0px;
  --menu-item-margin-y: 2px;
  --menu-item-padding-y: 21px;
  --menu-item-padding-x: 12px;
  --menu-item-indent: 16px;
  &.is-dark {
    --menu-item-color: rgb(var(--foreground));
  }
  &.is-light {
    --menu-item-color: rgb(var(--foreground));
    --menu-item-hover-color: var(--menu-item-color);
    --menu-item-active-color: rgb(var(--primary));
    --menu-item-active-background-color: rgba(var(--primary), 0.15);
    --menu-background-color: rgb(var(--sidebar));
    --menu-submenu-hover-color: rgb(var(--primary));
    --menu-submenu-hover-background-color: rgb(var(--accent));
    --menu-submenu-active-color: rgb(var(--primary));
  }

  &.is-rounded {
    --menu-item-radius: 8px;
    --menu-item-margin-x: 8px;
  }
}
@mixin menu-item {
  position: relative;
  color: var(--menu-item-color);
  display: flex;
  align-items: center;
  height: var(--menu-item-height);
  font-size: var(--menu-font-size);
  border-radius: var(--menu-item-radius);
  margin: 0 var(--menu-item-margin-x) var(--menu-item-margin-y)
  var(--menu-item-margin-x);
  padding: var(--menu-item-padding-y) var(--menu-item-padding-x);
  cursor: pointer;
  transition:
      background 0.15s ease,
      color 0.15s ease,
      padding 0.15s ease,
      border-color 0.15s ease;

  .#{$namespace}-menu__icon {
    transition: transform 0.25s;
  }
  &:hover{
    .#{$namespace}-menu__icon {
      transform: scale(1.2);
    }
  }
}

@mixin menu-title {
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
@mixin menu-item-active {
  color: var(--menu-item-active-color);
  cursor: pointer;
  background: var(--menu-item-active-background-color);
}

.#{$namespace}-menu {
  background: var(--menu-background-color);

  // 垂直菜单
  &.is-vertical {
    // 非折叠的时候
    &:not(.#{$namespace}-menu.is-collapse) {
      // 垂直菜单，非折叠的菜单，设置后代所有的菜单项和Submenu项的padding-left为：16 + level*16，第一级level=0
      & .#{$namespace}-menu-item,
      & .#{$namespace}-sub-menu-content {
        padding-left: calc(
            var(--menu-item-indent) + var(--menu-level) * var(--menu-item-indent)
        );
      }
      // 选中第一级有子菜单的项li
      & > .#{$namespace}-sub-menu {
        // 选中该li下面的二级ul
        & > .#{$namespace}-menu {
          // 选中二级ul中的li
          & > .#{$namespace}-menu-item {
            padding-left: calc(
                0px + var(--menu-item-indent) + var(--menu-level) *
                var(--menu-item-indent)
            );
          }
        }
        // 将第一级中的子菜单的项li中的那个div的padding-left设置为16 - 8
        & > .#{$namespace}-sub-menu-content {
          padding-left: calc(var(--menu-item-indent) - 8px);
        }
      }
      // 将第一级中没有子菜单的项li的padding-left设置为16 - 8
      & > .#{$namespace}-menu-item {
        padding-left: calc(var(--menu-item-indent) - 8px);
      }
    }
  }
  // flex-shrink: 0; 空间不足时是否可以缩小， 不会收缩（0），会（1）
  &__icon {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    margin-right: 8px;
  }
}
.#{$namespace}-sub-menu {
  &.is-active {
    .#{$namespace}-sub-menu-content {
      color: var(--menu-submenu-active-color);
    }
  }
}
.#{$namespace}-sub-menu-content {
  height: var(--menu-item-height);

  @include menu-item;

  &__icon-arrow {
    position: absolute;
    top: 50%;
    right: 10px;
    width: inherit;
    margin-top: -8px;
    margin-right: 0;
    font-weight: normal;
    opacity: 1;
    transition: transform 0.25s ease;
  }
  &:hover {
    color: var(--menu-submenu-hover-color);
    text-decoration: none;
    cursor: pointer;
    background: var(--menu-submenu-hover-background-color) !important;
  }
}
.#{$namespace}-menu-item {
  @include menu-item;

  &.is-active {
    @include menu-item-active;
  }

  &__content {
    display: inline-flex;
    align-items: center;
    width: 100%;
    height: var(--menu-item-height);

    span {
      @include menu-title;
    }
  }
  &:not(.is-active):hover {
    color: var(--menu-item-hover-color);
    cursor: pointer;
    background: rgb(var(--accent)) !important;
  }
}

</style>
