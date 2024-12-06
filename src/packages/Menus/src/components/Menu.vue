<template>
  <ul
    :class="[
      b(),
      is('collapse', collapse),
    ]"
    :style="menuStyle"
    class="is-vertical"
  >
    <slot/>
  </ul>
</template>
<script lang="ts" setup>
import type { MenuProps, MenuItemClicked, MenuProvider, SubMenuClicked, MenuItemRegistered } from '../type'
import { createMenuContext, createSubMenuContext } from '../hooks/useMenuContext'
import { useMenuStyle } from '../hooks/useMenu'
import { reactive, ref, watch, computed } from 'vue'
import { isHttpUrl } from '@/utils/is'
import { useNamespace } from '@/utils/composables/useNameSpace'
// 对组件进行命名
defineOptions({ name: 'MenuShow' })

interface PropsType extends MenuProps {}
const props = withDefaults(defineProps<PropsType>(), {
  collapse: false, // 菜单是否折叠，默认值
  rounded: true // 显示圆角
})

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

/**
 * 获取当前选中菜单的父级链路
 * */
function getActivePaths () {
  const activeItem = activePath.value && items.value[activePath.value]
  if (!activeItem || props.collapse) {
    return []
  }
  return activeItem.parentPaths
}
/**
 * 点击MenuItem菜单项
 * */
function handleMenuItemClick (data: MenuItemClicked) {
  const { collapse } = props
  // 如果是折叠的，清空所有展开的SubMenu
  if (collapse) {
    openedMenus.value = []
  }
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
 * 点击SubMenu
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
 * 展开菜单要存入subMenu对应的path
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
  // 手风琴模式菜单
  if (props.accordion) {
    // 点击当前subMenu对应的父级链路
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
// Vue 对于响应式数据的更新通常是批量处理的，这意味着如果你连续对 items 注入了多次数据，它可能只会触发一次 watch。
// Vue 会将这些更新合并为一次更新操作，以提高性能。如果你在同一个事件循环中多次更新 items.value，watch 只会触发一次
watch(items.value, initMenu)

watch(
  () => props.defaultActive,
  (currentActive = '') => {
    if (!items.value[currentActive]) {
      activePath.value = ''
    }
    updateActiveName(currentActive)
  }
)
function updateActiveName (val: string) {
  const itemsInData = items.value
  const item =
      itemsInData[val] ||
      (activePath.value && itemsInData[activePath.value]) ||
      itemsInData[props.defaultActive || '']

  activePath.value = item ? item.path : val
}

// 所有SubMenu对应的MenuItemRegistered数据都存这里
const subMenus = ref<MenuProvider['subMenus']>({})

// 处理默认展开菜单
function initMenu () {
  const parentPaths = getActivePaths()
  // 展开该菜单项的路径上所有子菜单
  parentPaths.forEach((path) => {
    const subMenu = subMenus.value[path]
    subMenu && openMenu(path, subMenu.parentPaths)
  })
}

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

const isMenuPopup = computed<MenuProvider['isMenuPopup']>(() => {
  return props.collapse
})

// 注入上下文
createMenuContext(
  reactive({
    activePath,
    handleMenuItemClick,
    handleSubMenuClick,
    openedMenus,
    openMenu,
    closeMenu,
    items,
    subMenus,
    addMenuItem,
    addSubMenu,
    removeSubMenu,
    removeMenuItem,
    props,
    isMenuPopup
  }))
const mouseInChild = ref(false)
createSubMenuContext({
  addSubMenu,
  level: 1,
  mouseInChild,
  removeSubMenu
})

// 折叠的时候清空选中的菜单数据
watch(
  () => props.collapse,
  (value) => {
    if (value) openedMenus.value = []
  }
)

</script>

<style lang="scss">
$namespace: zs;
.#{$namespace}-menu__popup-container,
.#{$namespace}-menu {
  --menu-item-height: 38px; /* MenuItem的高度 */
  --menu-font-size: 14px; /* MenuItem的文字大小 */
  --menu-item-radius: 8px; /* 鼠标移入和选中的radius */
  --menu-item-margin-x: 8px; /* MenuItem左右的margin */
  --menu-item-margin-y: 2px; /* MenuItem上下的margin */
  --menu-item-padding-y: 21px; /* MenuItem上下的padding */
  --menu-item-padding-x: 12px; /* MenuItem左右的padding */
  --menu-item-indent: 16px;
  --menu-item-popup-padding-y: 20px;
  --menu-item-popup-padding-x: 12px;
  --menu-item-collapse-padding-y: 23.5px;
  --menu-item-collapse-padding-x: 0px;
  --menu-item-collapse-margin-y: 4px;
  --menu-item-collapse-margin-x: 6px;

  --white-color: rgb(255,255,255); /* 白色 */
  --hover-color: rgb(46,48,51); /* hover颜色 */
  --menu-item-color: rgb(242,242,242, 0.8); /* item文字颜色 */
  --menu-item-hover-color: var(--white-color); /* item文字颜色-hover */
  --menu-item-active-color: var(--white-color); /* item文字颜色-选中 */
  --menu-item-hover-background-color: var(--hover-color); /* item背景颜色-hover */
  --menu-item-active-background-color: var(--hover-color); /* item背景颜色-选中 */
  --menu-background-color: rgb(var(--sidebar)); /* menu背景颜色 */
  --menu-submenu-hover-color: var(--white-color); /* submenu文字颜色-hover */
  --menu-submenu-hover-background-color: var(--hover-color);  /* submenu背景颜色-hover */
  --menu-submenu-active-color: var(--white-color); /* submenu文字颜色-选中 */
}

/* MenuItem的样式 */
@mixin menu-item {
  position: relative;
  color: var(--menu-item-color);
  display: flex;
  align-items: center;
  height: var(--menu-item-height);
  font-size: var(--menu-font-size);
  border-radius: var(--menu-item-radius);
  margin: 0 var(--menu-item-margin-x) var(--menu-item-margin-y) var(--menu-item-margin-x);
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
  /* 当鼠标移出MenuItem的时候，图标放大1.2倍 */
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
  &__popup-container {
    max-width: 240px;
    height: unset;
    padding: 0;
    background: var(--menu-background-color);
  }
  &__popup {
    padding: 10px 0;
    border-radius: var(--menu-item-radius);
    .#{$namespace}-sub-menu-content,
    .#{$namespace}-menu-item {
      padding: var(--menu-item-popup-padding-y) var(--menu-item-popup-padding-x);
    }
  }
  /* 只有最外层那个ul才有is-vertical，然后给这个类下面的这些样式做如下处理 */
  &.is-vertical {
    /* 非折叠的时候 */
    &:not(.#{$namespace}-menu.is-collapse) {
      /*设置后代所有的菜单项和Submenu项的padding-left为：16 + level*16，第一级level=0*/
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
            )!important;
          }
        }
        // 将第一级中的子菜单的项li中的那个div的padding-left设置为16 - 8
        & > .#{$namespace}-sub-menu-content {
          padding-left: calc(var(--menu-item-indent) - 8px)!important;
        }
      }
      // 将第一级中没有子菜单的项li的padding-left设置为16 - 8
      & > .#{$namespace}-menu-item {
        padding-left: calc(var(--menu-item-indent) - 8px);
      }
    }
  }

  /* flex-shrink: 0; 空间不足时是否可以缩小， 不会收缩（0），会（1）*/
  &__icon {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    margin-right: 8px;
    color: var(--menu-item-active-color);
  }
  /* 折叠的时候 */
  &.is-collapse {
    .#{$namespace}-menu__icon {
      margin-right: 0;
    }
    .#{$namespace}-sub-menu-content,
    .#{$namespace}-menu-item {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--menu-item-collapse-padding-y)
      var(--menu-item-collapse-padding-x);
      margin: var(--menu-item-collapse-margin-y)
      var(--menu-item-collapse-margin-x);
      transition: all 0.3s;

      &.is-active {
        background: var(--menu-item-active-background-color) !important;
        border-radius: var(--menu-item-radius);
      }
    }
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
    background: var(--menu-item-hover-background-color) !important;
  }

  .#{$namespace}-menu-tooltip__trigger {
    position: absolute;
    top: 0;
    left: 0;
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: 0 var(--menu-item-padding-x);
    font-size: var(--menu-font-size);
    line-height: var(--menu-item-height);
  }
}

</style>
