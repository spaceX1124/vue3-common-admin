<script setup lang="ts">
import {
  computed,
  nextTick,
  onMounted,
  ref,
  type StyleValue
} from 'vue'

defineOptions({
  name: 'Page'
})

interface PropsType {
  contentClass?: string;
  /**
   * 根据content可见高度自适应
   */
  autoContentHeight?: boolean;
}

const { autoContentHeight = false } = defineProps<PropsType>()

const shouldAutoHeight = ref(false)

const contentStyle = computed<StyleValue>(() => {
  if (autoContentHeight) {
    return {
      height: 'calc(var(--zs-content-height)',
      overflowY: shouldAutoHeight.value ? 'auto' : 'unset'
    }
  }
  return {}
})

async function calcContentHeight () {
  if (!autoContentHeight) {
    return
  }
  await nextTick()
  setTimeout(() => {
    shouldAutoHeight.value = true
  }, 30)
}

onMounted(() => {
  calcContentHeight()
})
</script>

<template>
  <div class="relative">
    <div class="h-full p-4" :class="contentClass" :style="contentStyle">
      <slot/>
    </div>
  </div>
</template>
