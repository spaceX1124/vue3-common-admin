<template>
  <div v-bind="{ ...$attrs }">
    <component v-bind="bindProps" :is="component"/>
  </div>
</template>
<script lang="ts" setup>
import { type Component, computed, onMounted, watch, unref, useAttrs, ref } from 'vue'
import type { IAsync } from '@/adapter'
import { useOptions } from '@/packages/Forms/src/components/utils.ts'
import { objectOmit } from '@vueuse/core'
import { isArray, isNullOrUndefOrEmpty } from '@/utils/is.ts'

interface PropsType {
  component: Component;
  async?: IAsync;
  modelValue?: string | string[];
  /** 组件的v-model属性名，默认为modelValue。部分组件可能为value，checked */
  modelPropName?: string;
  optionsPropName?: string;
  multiple?: boolean; 
}

const props = withDefaults(defineProps<PropsType>(), {
  modelPropName: 'modelValue',
  optionsPropName: 'options'
})

const emit = defineEmits(['update:modelValue', 'refreshOptions', 'updateOptions'])

const attrs = useAttrs()

const asyncComputed = computed(() => {
  return {
    immediate: true,
    ...props.async
  }
})

const { showList, getApiList, remoteApiData } = useOptions(asyncComputed)

// 双向绑定，外部可使用v-model或者modelValue的prop，update:modelValue的事件
// const modelNewValue = defineModel()
const selectVal = ref<string | string[]>()

const bindProps = computed(() => {
  return {
    [props.modelPropName]: unref(selectVal),
    [props.optionsPropName]: unref(showList), // @todo，后期考虑一下树型结构
    [`onUpdate:${props.modelPropName}`]: (val: string) => {
      selectVal.value = val
      emit('update:modelValue', val)
    },
    ...(asyncComputed.value?.remote ? { // 输入搜索
      remote: true,
      filterable: true,
      remoteMethod: remoteApiData
    } : {}),
    ...objectOmit(attrs, ['onUpdate:value']),
    multiple: props.multiple // 因为我props中有multiple，所以attrs中没有了
  }
})
watch(() => props.modelValue, (newVal) => {
  console.log(props.multiple, 'props.multiple')
  // 多选，转成数组
  if (props.multiple) {
    selectVal.value = !isNullOrUndefOrEmpty(newVal) ? isArray(newVal) ? newVal.map(String) : newVal.split(',') : []
  } else {
    selectVal.value = !isNullOrUndefOrEmpty(newVal) ? newVal : ''
  }
  console.log(selectVal, 'modelNewValue111', showList.value)
}, {
  immediate: true
})
/**
 * 更新字段异步数据
 * */
watch(() => showList.value, () => {
  console.log(showList.value, 'showList.value')
  emit('updateOptions', showList.value)
})
onMounted(() => {
  console.log(asyncComputed, 'asyncComputed')
  // 是否加载组件的时候就请获取api数据
  if (!asyncComputed.value?.remote && asyncComputed.value.immediate && asyncComputed.value.url) {
    getApiList()
  }
  // 用于外部使用，刷新下拉数据
  emit('refreshOptions', getApiList)
})
</script>