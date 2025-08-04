<template>
  <div class="flex-center">
    <el-select
      v-model="inputVal[0]"
      :placeholder="minPlaceholder || '请选择'"
      style="flex: 1"
      @change="handleStartChange"
      clearable
    >
      <el-option v-for="hour in hours" :key="hour" :label="`${hour}时`" :value="hour" />
    </el-select>
    <span style="padding: 0 12px">至</span>
    <el-select
      v-model="inputVal[1]"
      :placeholder="maxPlaceholder || '请选择'"
      style="flex: 1"
      @change="handleEndChange"
      clearable
    >
      <el-option v-for="hour in hours" :key="hour" :label="`${hour}时`" :value="hour" />
    </el-select>
  </div>
</template>

<script lang="ts" setup>
import { watch, ref } from 'vue'
import { isNullOrUndefOrEmpty } from '@/utils/is.ts'

interface PropsType {
  modelValue?: string[];
  minPlaceholder?: string;
  maxPlaceholder?: string;

}
const props = defineProps<PropsType>()
const emit = defineEmits(['update:modelValue'])

const inputVal = ref<[string, string]>(['', ''])

watch(() => props.modelValue, (value) => {
  if (value) {
    if (!isNullOrUndefOrEmpty(value[0])) {
      inputVal.value[0] = String(value[0])
    } else {
      inputVal.value[0] = ''
    }
    if (!isNullOrUndefOrEmpty(value[1])) {
      inputVal.value[1] = String(value[1])
    } else {
      inputVal.value[1] = ''
    }
  } else {
    inputVal.value = ['', '']
  }
}, {
  immediate: true
})

// 生成0-23小时数组
const hours = Array.from({ length: 24 }, (_, i) => i)
// 处理开始时间变化
const handleStartChange = (val) => {
  emit('update:modelValue', inputVal.value)
  // if (props.schema?.componentEvent) {
  //   props.schema.componentEvent?.onChange(inputVal.value[0])
  // }
}
// 处理结束时间变化
const handleEndChange = (val) => {
  emit('update:modelValue', inputVal.value)
  // if (props.schema?.componentEvent) {
  //   props.schema.componentEvent?.onChange(inputVal.value[0])
  // }
}

defineOptions({ inheritAttrs: false })
</script>