<template>
  <component :is="formComponent">
    <div class="grid gap-x-4" :class="wrapperClass">
      <template v-for="cSchema in computedSchema" :key="cSchema.key">
        <FormField v-bind="cSchema" :class="cSchema.formItemClass" class="flex-shrink-0"/>
      </template>
    </div>
  </component>
</template>
<script lang="ts" setup>
import FormField from './form-field.vue'
import { computed, onMounted, ref } from 'vue'
import { useFormContext } from '../hooks/useCreateContext'
import type { ISchema } from '@/adapter'

const formComponent = ref('form')
// 获取透传数据
const { config, formMethods } = useFormContext()

// 获取表单栅格布局
const wrapperClass = computed(() => {
  return formMethods.staticState.value.wrapperClass
})
// 得到表单数据结构，用于循环渲染
const computedSchema = computed(() => {
  // 当formMethods.state.value.schema数据更新，这儿也会对应的更新
  // item类型推导不出来，只有重新定义类型
  console.log(formMethods.schema.value, 'p0')
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