<template>
  <form>
    <div class="grid" :class="gridCols">
      <template v-for="cSchema in computedSchema" :key="cSchema.key">
        <template v-if="cSchema.component === 'FormTitle'">
          <FormTitle class="col-span-full" v-bind="cSchema"/>
        </template>
        <FormField v-else v-bind="cSchema" :class="cSchema.formItemClass" class="flex-shrink-0"/>
      </template>
    </div>
  </form>
</template>
<script lang="ts" setup>
import { FormTitle } from '../components'
import { computed, onMounted } from 'vue'

import FormField from './form-field.vue'
import { useFormContext } from '../hooks/useCreateContext'
import type { ISchema } from '@/adapter'

// 获取透传数据
const { config, formMethods } = useFormContext()

// 控制报表单一行展示几个，表单项的间距
const gridCols = computed(() => {
  return [formMethods.staticState.value.gridCols, formMethods.staticState.value.gutters]
})
// 得到表单数据结构，用于循环渲染
const computedSchema = computed(() => {
  // 当formMethods.state.value.schema数据更新，这儿也会对应的更新
  // item类型推导不出来，只有重新定义类型
  return formMethods.schema.value.map((item: ISchema) => {
    // 还需要处理，有些字段在没传的情况下需要处理默认值
    return {
      labelWidth: config.labelWidth || 100,
      ...item
    }
  })
})
onMounted(() => {

})
</script>