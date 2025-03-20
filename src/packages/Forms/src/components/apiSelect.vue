<template>
  <ElSelectV2
    @focus="getOptionsList"
    v-bind="$attrs"
    :options="showList"
    :filterable="schema.async?.remote || schema.componentProps?.filterable"
    :remote="schema.async?.remote"
    :remote-method="remoteMethod"
    :loading="loading"
  />
</template>
<script lang="ts" setup>
import { type Component, watch } from 'vue'
import { debounce } from 'lodash-es'
import { ElSelectV2 } from 'element-plus'
import { useOptions } from './utils'
import type { ISchema } from '@/adapter'
import { useFormContext } from '../hooks/useCreateContext'
interface PropsType {
  component: Component,
  schema: ISchema,
}
const props = withDefaults(defineProps<PropsType>(), {
})
// 获取透传数据
const { formMethods } = useFormContext()
const { showList, getOptionsList, searchData, loading } = useOptions(props.schema)

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

/**
 * 更新字段异步数据
 * */
watch(() => showList.value, () => {
  formMethods.updateField(props.schema.fieldKey, 'componentProps.options', showList.value)
})

</script>