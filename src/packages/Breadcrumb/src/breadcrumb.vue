<template>
  <ul class="flex breadcrumb-box">
    <TransitionGroup name="breadcrumb-transition">
      <li
        v-for="(item, index) in breadcrumbs"
        :key="`${item.path}-${item.title}-${index}`"
        class="bg-background h-7 text-[13px] flex-center">
        <span>{{item.title}}</span>
      </li>
    </TransitionGroup>

  </ul>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import type { IBreadcrumb } from './type'
import { useRoute } from 'vue-router'
const route = useRoute()
const breadcrumbs = computed((): IBreadcrumb[] => {
  const matched = route.matched
  const resultBreadcrumb: IBreadcrumb[] = []
  for (const match of matched) {
    const { meta, path } = match
    resultBreadcrumb.push({
      path: path || route.path,
      title: meta?.title as string || ''
    })
  }
  return resultBreadcrumb
})
</script>
<style lang="scss" scoped>
.breadcrumb-box {
  >li {
    @apply relative mr-9 pl-[5px] pr-2;

    &::before,
    &::after {
      border-color: rgb(var(--bg-background));
      @apply absolute top-0 h-0 w-0 border-[.875rem] border-solid content-[''];
    }
    &::before {
      border-left-color: transparent;
      @apply -left-7 z-10 border-l-transparent;
    }
    &::after {
      border-color: transparent;
      border-left-color: rgb(var(--bg-background))!important;
      @apply left-full border-transparent;
    }
    &:first-child::before {
      @apply border-none;
    }
    &:last-child::after {
      @apply border-none;
    }

    &:first-child {
      @apply rounded-[4px_0_0_4px] pl-[15px];
    }

    &:last-child{
      @apply rounded-[0_4px_4px_0] pr-[15px];
    }
  }
}
</style>