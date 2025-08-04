<template>
  <!-- w-full 解决了表格宽度一点点缩小的问题 -->
  <main ref="contentElement" class="relative flex-1 bg-background w-full overflow-y-hidden">
    <!-- 展示遮罩层loading -->
    <slot name="overlay"/>
    <!-- 展示主要内容 -->
    <slot/>
  </main>
</template>
<script lang="ts" setup>
// import { useLayoutContentStyle } from '@/utils/composables/useLayoutStyle'
//
// const { contentElement } = useLayoutContentStyle()
</script>