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

<template>
  <section
    :style="style"
    class="border-b flex"
  >
    <slot/>
  </section>
</template>
