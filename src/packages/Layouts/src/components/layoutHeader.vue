<template>
  <header :style="style" style="height: 50px" class="border-b flex items-center w-full">
    <slot name="toggle-button"/>
    <slot/>
  </header>
</template>
<script lang="ts" setup>
import type { CSSProperties } from 'vue'
import { computed } from 'vue'
interface PropsType {
  height: number; // 高度
}
const props = withDefaults(defineProps<PropsType>(), {})
const style = computed((): CSSProperties => {
  const { height } = props
  return {
    height: `${height}px`
  }
})
</script>