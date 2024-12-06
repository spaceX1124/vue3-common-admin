<template>
  <div class="h-full flex" :class="[nsTabs.b()]" ref="tabsRef">
    <div
      v-for="(tab, i) in tabsView"
      :key="tab.key"
      ref="tabRef"
      class="h-full cursor-pointer translate-all"
      :class="[
        b(),
        is('active', active === tab.key),
        active === tab.key && 'active-tag'
      ]"
      @click.stop="active = tab.key"
    >
      <div class="relative size-full px-1">
        <!-- divider -->
        <div
          v-if="i !== 0 && tab.key !== active"
          :class="[m('divider')]"
          class="absolute left-[var(--gap)] top-1/2 z-0 h-4 w-[1px] translate-y-[-50%] transition-all"
        />
        <!-- background -->
        <div :class="[m('background')]" class="absolute size-full z-[-1] px-1.5" >
          <div :class="[m('background-content')]" class="h-full rounded-t-lg transition-all duration-200"/>
          <svg height="7" width="7" class="absolute bottom-0 left-[-1px] fill-background transition-all duration-200">
            <path d="M 0 7 A 7 7 0 0 0 7 0 L 7 7 Z" />
          </svg>
          <svg height="7" width="7" class="absolute bottom-0 right-[-1px] fill-background transition-all duration-200">
            <path d="M 0 0 A 7 7 0 0 0 7 7 L 0 7 Z" />
          </svg>
        </div>
        <!-- 关闭和固定 -->
        <div
          class="tabs-chrome__extra absolute right-[7px] top-1/2 z-[3] size-4 translate-y-[-50%]"
        >
          <!-- close-icon -->
          <X
            v-show="tabsView.length > 1"
            class="mt-[2px] size-3 cursor-pointer rounded-full transition-all"
            @click.stop="() => emit('close', tab.key)"
          />
        </div>
        <!-- content -->
        <div :class="[e('content')]" class="h-full flex items-center px-4 pl-2 mx-3.5">
          <span class="text-sm whitespace-nowrap">
            {{ tab.title }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, unref } from 'vue'
import type { TabsProps } from '../type'
import { useNamespace } from '@/utils/composables/useNameSpace'
import { X } from '@/packages/Icons'
interface PropsType extends TabsProps {}
const props = withDefaults(defineProps<PropsType>(), {
  contentClass: 'zs-tabs-content',
  contextMenus: () => [],
  gap: 7,
  tabs: () => []
})

const emit = defineEmits<{
  close: [string];
  onMounted: [];
}>()

const active = defineModel<string>('active')

const nsTabs = useNamespace('tabs')
const { b, is, e, m } = useNamespace('tabs-item')

// 用于tabs的回显数据
const tabsView = computed(() => {
  return props.tabs.map((tab) => {
    const { fullPath, meta, name, path } = tab || {}
    const { title, newTabTitle } = meta || {}
    return {
      key: fullPath || path,
      title: (newTabTitle || title || name) as string
    }
  })
})
const tabsRef = ref()
function getTabsRef () {
  return tabsRef.value
}
defineExpose({
  getTabsRef
})
onMounted(() => {
  emit('onMounted')
})

</script>
<style lang="scss" scoped>
$namespace: zs;
.#{$namespace}-tabs {
  display: flex;
  white-space: nowrap;
  align-items: center;
  transition: all ease-in 0.1s;
  position: relative;
  left: 0;
  top: 0;
  &-item {
    .fill-background {
      fill: transparent;
    }
    &--divider {
      background: rgba(var(--primary), 0.15);
    }
    &:not(.is-active):hover {
       & + .#{$namespace}-tabs-item {
        .#{$namespace}-tabs-item--divider {
          @apply opacity-0;
        }
      }
      .#{$namespace}-tabs-item--background {
        padding-bottom: 2px;

      }
      .#{$namespace}-tabs-item--background-content {
        background: rgba(var(--primary), 0.15);
        border-radius: 7px;
        @apply mx-[2px];
      }

    }
    &.is-active {
      .#{$namespace}-tabs-item--background-content {
        background: rgba(var(--primary), 0.15);
      }
      .fill-background {
        fill: rgba(var(--primary), 0.15);
      }
      .#{$namespace}-tabs-item__content {
        span {
          color: rgb(var(--primary));
        }

      }
      .#{$namespace}-tabs-item--divider {
        @apply opacity-0;
      }
      /* 相邻选择器：当前is-active相邻的第一个元素.#{$namespace}-tabs-item */
      & + .#{$namespace}-tabs-item {
        .#{$namespace}-tabs-item--divider {
          @apply opacity-0;
        }
      }
    }
  }
}

</style>