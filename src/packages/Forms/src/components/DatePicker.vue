<template>
  <div>
    <el-date-picker
      v-bind="$attrs"
      v-model="selectVal"
      style="width: 100%"
      :type="schema?.componentProps?.type || 'date'"
      :format="schema?.componentProps?.format || 'YYYY-MM-DD'"
      :valueFormat="schema?.componentProps?.valueFormat || 'YYYYMMDD'"
      :placeholder="schema?.componentProps?.placeholder || '请选择日期'"
      :start-placeholder="schema?.componentProps?.startPlaceholder || '开始日期'"
      :end-placeholder="schema?.componentProps?.endPlaceholder || '结束日期'"
      @change="change"
      :name="[]"
    />
  </div>
</template>
<script lang="ts" setup>
import type { ISchema } from '@/adapter'
import { ref, watch } from 'vue'
import { isArray, isNullOrUndefOrEmpty } from '@/utils/is.ts'

interface PropsType {
  modelValue?: string | string[];
  schema?: Partial<ISchema>;
}
const props = defineProps<PropsType>()
const emit = defineEmits(['update:modelValue', 'change'])

const selectVal = ref<string | string[]>()
watch(() => props.modelValue, (newVal) => {
  // 区间，转成数组
  if (props.schema?.componentProps?.type.includes('range') || (props.schema?.fieldKeyArr && props.schema?.fieldKeyArr.length > 1)) {
    selectVal.value = !isNullOrUndefOrEmpty(newVal) ? isArray(newVal) ? newVal.map(String) : newVal.split(',') : []
  } else {
    selectVal.value = !isNullOrUndefOrEmpty(newVal) ? newVal : ''
  }
}, {
  immediate: true
})

function change () {
  emit('update:modelValue', selectVal.value)
  emit('change', selectVal.value)
}
</script>