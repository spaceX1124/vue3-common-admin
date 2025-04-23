<template>
  <el-radio-group :model-value="values">
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
import { computed, type Component, onBeforeMount, watch, ref } from 'vue'
import { ElRadio, ElRadioGroup, ElRadioButton } from 'element-plus'

import type { ISchema } from '@/adapter'
import { useOptions } from './utils'
import { useFormContext } from '@/packages/Forms/src/hooks/useCreateContext'

interface PropsType {
  component: Component;
  schema: ISchema;
  modelValue: any;
  options?: Record<string, any>[];
}
const props = withDefaults(defineProps<PropsType>(), {})

const values = ref('')

const showComponent = computed(() => {
  return props.schema?.componentProps?.isButton ? ElRadioButton : ElRadio
})

const { formMethods } = useFormContext()
const { showList, getOptionsList, dealDataList } = useOptions(props.schema)

/**
 * 处理单选框选中和取消选中
 * */
function choose (item: Record<string, any>) {
  formMethods.setFieldValue(props.schema.fieldKey, values.value === item.value ? '' : item.value)
}

/**
 * 更新字段异步数据
 * */
watch(() => showList.value, () => {
  formMethods.updateFieldProperty(props.schema.fieldKey, 'componentProps.options', showList.value)
})

watch(() => props.modelValue, (value) => {
  values.value = String(value)
})

onBeforeMount(async () => {
  if (props.schema.async && props.schema.async.url) {
    await getOptionsList()
  } else {
    dealDataList(props.options)
  }
})
</script>