<template>
  <ul class="flex breadcrumb-box">
    <TransitionGroup name="breadcrumb-transition">
      <li
        v-for="(item, index) in breadcrumbs"
        :key="`${item.path}-${item.title}-${index}`"
        class="bg-background flex-center">
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
  // 包含了当前路由匹配到的所有嵌套层级的路由记录
  const matched = route.matched
  const resultBreadcrumb: IBreadcrumb[] = []
  for (const match of matched) {
    if (match.meta.hideInBreadcrumb) {
      continue
    }
    const { meta, path } = match
    if (meta.title) {
      resultBreadcrumb.push({
        path: path || route.path,
        title: meta?.title as string || ''
      })
    }
  }
  return resultBreadcrumb
})
</script>
<style lang="scss" scoped>
.breadcrumb-box {
  >li {
    height: 28px;
    font-size: 13px;
    position: relative;
    margin-right: 36px;
    padding-left: 5px;
    padding-right: 8px;

    &::before,
    &::after {
      position: absolute;
      top: 0;
      height: 0;
      width: 0;
      border-width: 14px;
      border-color: rgb(var(--bg-background));
      border-style: solid;
      content: "";
    }
    &::before {
      left: -28px;
      z-index: 10;
      border-left-color: transparent;
    }
    &::after {
      border-color: transparent;
      border-left-color: rgb(var(--bg-background))!important;
      left: 100%;
    }
    &:first-child::before {
      border-style: none;
    }
    &:last-child::after {
      border-style: none;
    }

    &:first-child {
      border-radius: 4px 0 0 4px;
      padding-left: 15px;
    }

    &:last-child{
      border-radius: 0 4px 4px 0;
      padding-right: 15px;
    }
  }
}
.breadcrumb-transition-enter-active {
  transition:
      transform 0.4s cubic-bezier(0.76, 0, 0.24, 1),
      opacity 0.4s cubic-bezier(0.76, 0, 0.24, 1);
}

.breadcrumb-transition-leave-active {
  display: none;
}

.breadcrumb-transition-enter-from {
  opacity: 0;
  transform: translateX(30px) skewX(-30deg);
}

</style>