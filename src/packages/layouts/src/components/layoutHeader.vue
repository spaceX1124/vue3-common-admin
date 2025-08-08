<template>
  <header :style="style" style="height: 50px" class="header flex items-center w-full bg-white">
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
<style lang="scss" scoped>
.header {
  border-bottom-width: 1px;
}
</style>