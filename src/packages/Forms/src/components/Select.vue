<template>
  <ElSelectV2
    @focus="getOptionsList"
    v-bind="$attrs"
    :options="showList"
    :filterable="schema?.async?.remote || schema?.componentProps?.filterable"
    :remote="schema?.async?.remote"
    :remote-method="remoteMethod"
    :loading="loading"
    loading-text="加载中"
    no-data-text="无数据"
    v-model="selectVal"
    @change="change"
  />
</template>
<script lang="ts" setup>
import { onBeforeMount, watch, onMounted, ref } from 'vue'
import { debounce } from 'lodash-es'
import { ElSelectV2 } from 'element-plus'

import type { ISchema } from '@/adapter'
import { useOptions } from './utils'
import { isArray, isNullOrUndefOrEmpty } from '@/utils/is.ts'
interface PropsType {
  modelValue?: string | string[];
  schema?: Partial<ISchema>;
  options?: Record<string, any>[];
}
const props = withDefaults(defineProps<PropsType>(), {})
const emit = defineEmits(['update:modelValue', 'refreshOptions', 'updateOptions', 'change'])

const { showList, getOptionsList, getOptionsListNow, searchData, loading, flag, dealDataList } = useOptions(props.schema)

// 远程搜索，我加个防抖
const debounceSearch = debounce(searchData, 300, { leading: true })
// 开启了输入搜索，加载远程数据，还是加一下防抖
function remoteMethod (query?: string) {
  if (query) {
    debounceSearch(query)
  } else {
    showList.value = []
  }
}

function change () {
  emit('update:modelValue', selectVal.value)
  emit('change', selectVal.value)
}

/**
 * 更新字段异步数据
 * */
watch(() => showList.value, () => {
  emit('updateOptions', showList.value)
})

onBeforeMount( () => {
  if (!props.schema?.async) {
    dealDataList(props.options || [])
  }
})

async function refresh () {
  flag.value = true
  await getOptionsListNow()
}

const selectVal = ref<string | string[]>()
watch(() => props.modelValue, (newVal) => {
  // 多选，转成数组
  if (props.schema?.componentProps?.multiple) {
    selectVal.value = !isNullOrUndefOrEmpty(newVal) ? isArray(newVal) ? newVal.map(String) : newVal.split(',') : []
  } else {
    selectVal.value = !isNullOrUndefOrEmpty(newVal) ? newVal : ''
  }
}, {
  immediate: true
})

onMounted(() => {
  // 用于外部使用，刷新下拉数据
  emit('refreshOptions', refresh)
})
</script>