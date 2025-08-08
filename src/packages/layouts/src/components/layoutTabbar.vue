<template>
  <section
    :style="style"
    class="flex"
  >
    <slot/>
  </section>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { computed } from 'vue'

interface Props {
  height: number; // 高度
}
const props = withDefaults(defineProps<Props>(), {})

const style = computed((): CSSProperties => {
  const { height } = props
  return {
    height: `${height}px`
  }
})
</script>

<style lang="scss" scoped>
section {
  border-bottom-width: 1px;
}
</style>
