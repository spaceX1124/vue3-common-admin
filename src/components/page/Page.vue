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
  <div class="page h-full" :class="contentClass" :style="contentStyle">
    <div class="page-box h-full bg-white">
      <slot/>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.page {
  padding: 14px;
  .page-box {
    padding: 12px;
    border-radius: 6px;
  }
}
</style>
