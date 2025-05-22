<script setup lang="ts">
import { computed, ref, type StyleValue } from 'vue'

defineOptions({
  name: 'Page'
})

interface PropsType {
  contentClass?: string;
  autoContentHeight?: boolean; // 根据content可见高度自适应
}

const { autoContentHeight = false } = defineProps<PropsType>()

const contentStyle = computed<StyleValue>(() => {
  return {
    'overflow-y': autoContentHeight ? 'hidden' : 'auto'
  }
})

</script>

<template>
  <div class="h-full p-3.5" :class="contentClass" :style="contentStyle">
    <div class="h-full p-3 rounded-md bg-white">
      <slot/>
    </div>
  </div>
</template>
