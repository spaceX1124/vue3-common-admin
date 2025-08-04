<!-- 单选组件，支持选中取消，支持异步请求 -->
<template>
  <el-radio-group :model-value="selectVal">
    <component
      :is="showComponent"
      v-for="(item, index) in showList"
      :key="index"
      :label="item.label"
      :value="item.value"
      :disabled="item.disabled"
      @click="choose(item)"
    >
      {{ item.label }}
    </component>
  </el-radio-group>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, watch, ref } from 'vue'
import { ElRadioButton, ElRadio } from 'element-plus'

import type { IAsync } from '@/adapter'
import { useOptions } from './utils'

interface PropsType {
  async?: IAsync;
  modelValue?: string | number;
  options?: Record<string, any>[];
  isButton?: boolean;
}
const props = withDefaults(defineProps<PropsType>(), {})
const emit = defineEmits(['update:modelValue', 'refreshOptions', 'updateOptions', 'change'])

const selectVal = ref('')

const asyncComputed = computed(() => {
  return {
    immediate: true,
    ...props.async
  }
})

const showComponent = computed(() => {
  return props.isButton ? ElRadioButton : ElRadio
})

const { showList, getApiList, dealDataList } = useOptions(asyncComputed)

// 没有给el-radio-group双向绑定，绑定change事件不执行
/**
 * 处理单选框选中和取消选中
 * */
function choose (item: Record<string, any>) {
  let val = selectVal.value === item.value ? '' : item.value
  emit('update:modelValue', val)
  emit('change', val)
}

/**
 * 更新字段异步数据
 * */
watch(() => showList.value, () => {
  emit('updateOptions', showList.value)
})

watch(() => props.modelValue, (value) => {
  selectVal.value = String(value)
}, {
  immediate: true
})

onBeforeMount(async () => {
  if (asyncComputed.value.url && asyncComputed.value.immediate) {
    await getApiList()
    // 用于外部使用，刷新下拉数据
    emit('refreshOptions', getApiList)
  } else {
    dealDataList(props.options)
  }
})

</script>