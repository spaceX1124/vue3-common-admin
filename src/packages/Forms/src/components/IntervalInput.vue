<!-- 区间输入 -->
<template>
  <div class="flex items-center">
    <el-input
      v-model.trim="inputVal[0]"
      :placeholder="schema?.extraConfig?.minPlaceholder || '请输入最小值'"
      @blur="changeBlur"
      :clearable="clearable"
    />
    <span class="mx-2">-</span>
    <el-input
      v-model.trim="inputVal[1]"
      :placeholder="schema?.extraConfig?.maxPlaceholder || '请输入最大值'"
      @blur="changeBlur"
      :clearable="clearable"
    />
  </div>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue'
import type { ISchema } from '@/adapter'

interface PropsType {
  modelValue?: string[];
  schema?: Partial<ISchema>,
  clearable?: boolean;
}
const props = withDefaults(defineProps<PropsType>(), {})
const emit = defineEmits(['update:modelValue', 'validField'])

const inputVal = ref<string[]>([])

function changeBlur () {
  emit('update:modelValue', inputVal.value)
  emit('validField')
}

watch(() => props.modelValue, (value) => {
  inputVal.value = value || []
})

</script>