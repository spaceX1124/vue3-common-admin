<template>
  <div class="tabs h-full flex" ref="tabsRef">
    <TransitionGroup name="slide-left">
      <div
        v-for="(tab, i) in tabsView"
        :key="tab.key"
        ref="tabRef"
        class="tabs-item h-full pointer translate-all"
        :class="{'tabs-item-active': active === tab.key}"
        @click.stop="active = tab.key"
      >
        <div class="relative tabs-item-child w-full h-full">
          <!-- divider -->
          <div
            v-if="i !== 0 && tab.key !== active"
            class="tabs-item--divider absolute transition-all"
          />
          <!-- background -->
          <div class="tabs-item--background absolute w-full h-full" >
            <div class="tabs-item--background-content h-full transition-all"/>
            <svg height="7" width="7" class="svg-1 absolute fill-background transition-all">
              <path d="M 0 7 A 7 7 0 0 0 7 0 L 7 7 Z" />
            </svg>
            <svg height="7" width="7" class="svg-2 absolute fill-background transition-all">
              <path d="M 0 0 A 7 7 0 0 0 7 7 L 0 7 Z" />
            </svg>
          </div>
          <!-- 关闭和固定 -->
          <div
            class="close-icon absolute"
          >
            <X
              v-show="tabsView.length > 1"
              class="icon pointer transition-all"
              @click.stop="() => emit('close', tab.key)"
            />
          </div>
          <!-- content -->
          <div class="tabs-item__content h-full flex items-center">
            <span class="tabs-item__content__span">
              {{ tab.title }}
            </span>
          </div>
        </div>
      </div>
    </TransitionGroup>

  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import type { TabsProps } from '../type'
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
.tabs {
  display: flex;
  white-space: nowrap;
  align-items: center;
  transition: all ease-in 0.1s;
  position: relative;
  left: 0;
  top: 0;
  .tabs-item {
    .tabs-item-child {
      padding: 0 4px;
    }

    &--divider {
      background: rgba(var(--primary), 0.15);
      left: 7px;
      z-index: 0;
      height: 16px;
      top: 50%;
      transform: translateY(-50%);
      width: 1px;
    }
    &--background {
      z-index: -1;
      padding-left: 6px;
      padding-right: 6px;
      &-content {
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
      }
      .svg-1 {
        bottom: 0;
        left: -1px;
      }
      .svg-2 {
        bottom: 0;
        right: -1px;
      }
      .fill-background {
        fill: transparent;
      }
    }
    .close-icon {
      right: 7px;
      top: 50%;
      transform: translateY(-50%);
      z-index: 3;
      width: 16px;
      height: 16px;
      .icon {
        margin-top: 2px;
        width: 12px;
        height: 12px;
      }
    }
    .tabs-item__content {
      padding-right: 16px;
      padding-left: 8px;
      margin: 0 14px;
      .tabs-item__content__span {
        font-size: 14px;
        line-height: 20px;
        white-space: nowrap;
      }
    }
    &:not(.tabs-item-active):hover {
      & + .tabs-item {
        .tabs-item--divider {
          @apply opacity-0;
        }
      }
      .tabs-item--background {
        padding-bottom: 2px;

      }
      .tabs-item--background-content {
        background: rgba(var(--primary), 0.15);
        border-radius: 7px;
        margin: 0 2px;
      }

    }
    &.tabs-item-active {
      .tabs-item--background-content {
        background: rgba(var(--primary), 0.15);
      }
      .fill-background {
        fill: rgba(var(--primary), 0.15);
      }
      .tabs-item__content {
        span {
          color: rgb(var(--primary));
        }

      }
      .tabs-item--divider {
        @apply opacity-0;
      }
      & + .tabs-item {
        .tabs-item--divider {
          @apply opacity-0;
        }
      }
    }
  }
}

</style>