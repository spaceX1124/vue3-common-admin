<!-- 区间输入 -->
<template>
  <div class="flex items-center">
    <el-input
      v-model.trim="inputVal[0]"
      :placeholder="schema.extraConfig?.minPlaceholder || '请输入最小值'"
      @blur="changeBlur"
    />
    <span class="mx-2">-</span>
    <el-input
      v-model.trim="inputVal[1]"
      :placeholder="schema.extraConfig?.maxPlaceholder || '请输入最大值'"
      @blur="changeBlur"
    />
  </div>
</template>
<script lang="ts" setup>
import { ref, type Component, watch, onMounted } from 'vue'
import { ElInput } from 'element-plus'

import type { ISchema } from '@/adapter'
import { useFormContext } from '../hooks/useCreateContext'
const { formMethods } = useFormContext()

interface PropsType {
  component: Component,
  schema: ISchema,
  modelValue: string[] | undefined;
}
const props = withDefaults(defineProps<PropsType>(), {})

const inputVal = ref<string[]>([])

function changeBlur () {
  console.log(inputVal, 'inputVal')
  formMethods.setFieldValue(props.schema.fieldKey, inputVal.value)
  formMethods.validField(props.schema.fieldKey)
}

watch(() => props.modelValue, (value) => {
  inputVal.value = value || []
})

onMounted(() => {
})
</script>