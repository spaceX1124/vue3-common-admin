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

import type { ISchema } from '@/adapter'
import { useOptions } from './utils'

interface PropsType {
  modelValue?: string | number;
  schema?: Partial<ISchema>;
  options?: Record<string, any>[];
}
const props = withDefaults(defineProps<PropsType>(), {})
const emit = defineEmits(['update:modelValue', 'refreshOptions', 'updateOptions', 'change'])

const selectVal = ref('')

const showComponent = computed(() => {
  return props.schema?.componentProps?.isButton ? ElRadioButton : ElRadio
})

const { showList, getOptionsListNow, dealDataList, flag } = useOptions(props.schema)

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

async function refresh () {
  flag.value = true
  await getOptionsListNow()
}

onBeforeMount(async () => {
  if (props.schema?.async && props.schema.async.url) {
    await getOptionsListNow()
    // 用于外部使用，刷新下拉数据
    emit('refreshOptions', refresh)
  } else {
    dealDataList(props.options)
  }
})

</script>