<!-- 区间输入 -->
<template>
  <div class="flex items-center">
    <el-input
      v-model.trim="inputVal[0]"
      placeholder="请输入最小值"
      @blur="changeInput"
    />
    <span class="mx-2">-</span>
    <el-input
      v-model.trim="inputVal[1]"
      placeholder="请输入最大值"
      @blur="changeInput"
    />
  </div>
</template>
<script lang="ts" setup>
import { ref, type Component } from 'vue'
import { ElInput } from 'element-plus'
import type { ISchema } from '@/adapter'

import { useFormContext } from '../hooks/useCreateContext'
const { formMethods } = useFormContext()

interface PropsType {
  component: Component,
  schema: ISchema,
}
const props = withDefaults(defineProps<PropsType>(), {
})

function changeInput () {
  formMethods.setFieldValue(props.schema.fieldKey, inputVal.value)
  formMethods.validField(props.schema.fieldKey)
}

const inputVal = ref<string[]>([])
</script>