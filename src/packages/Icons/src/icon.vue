<template>
  <component :is="icon" v-if="isComponent" v-bind="$attrs"/>
  <img :src="icon as string" v-else-if="isHttpIcon" v-bind="$attrs" alt="">
  <IconifyIcon :icon="icon as string" v-else-if="icon" v-bind="$attrs"/>
  <IconDefault v-else-if="fallback" v-bind="$attrs" />
</template>
<script lang="ts" setup>
import { isString, isObj, isFunc, isHttpUrl } from '@/packages/utils/is'
import { computed, type Component } from 'vue'
import { Icon as IconifyIcon } from '@iconify/vue'
import { IconDefault } from './lucide'

const props = defineProps<{
  icon?: Component | Function | string;
  fallback?: boolean;
}>()
// 接收的是组件
const isComponent = computed(() => {
  const { icon } = props
  return !isString(icon) && (isObj(icon) || isFunc(icon))
})
// 接收的是远程地址
const isHttpIcon = computed(() => {
  return isString(props.icon) && isHttpUrl(props.icon)
})
</script>