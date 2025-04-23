<template>
  <div>
    <el-checkbox
      v-if="isAll"
      v-model="checkAll"
      :indeterminate="isIndeterminate"
      @change="handleCheckAllChange"
    >
      全选
    </el-checkbox>
    <el-checkbox-group
      v-bind="$attrs"
      @change="handleCheckedCitiesChange"
    >
      <el-checkbox
        v-for="(item, index) in showList"
        :key="index"
        :label="item.label"
        :value="item.value"
        :disabled="item.disabled"
      >
        {{ item.label }}
      </el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script lang="ts" setup>
import { type Component, ref, computed, onBeforeMount, watch } from 'vue'
import { type CheckboxValueType, ElCheckbox, ElCheckboxGroup } from 'element-plus'

import type { ISchema } from '@/adapter'
import { useFormContext } from '../hooks/useCreateContext'
import { useOptions } from '@/packages/Forms/src/components/utils'

interface PropsType {
  component: Component,
  schema: ISchema,
  options?: Record<string, any>[]
}

const props = withDefaults(defineProps<PropsType>(), {})

const checkAll = ref<boolean>(false)
const isIndeterminate = ref(false)

const { formMethods } = useFormContext()
const { showList, getOptionsList } = useOptions(props.schema)

// 是否展示全选
const isAll = computed(() => {
  return props.schema.extraConfig?.isAll || false
})

function handleCheckAllChange (val: CheckboxValueType) {
  let values = []
  val && (values = showList.value.filter(item => !item.disabled).map(item => item.value))
  formMethods.setFieldValue(props.schema.fieldKey, values)
  isIndeterminate.value = false
}
function handleCheckedCitiesChange (value: string[]) {
  const checkedCount = value.length
  checkAll.value = checkedCount === showList.value.filter(item => !item.disabled).length
  isIndeterminate.value = checkedCount > 0 && checkedCount < showList.value.filter(item => !item.disabled).length
}

/**
 * 更新字段异步数据
 * */
watch(() => showList.value, () => {
  formMethods.updateFieldProperty(props.schema.fieldKey, 'componentProps.options', showList.value)
})

onBeforeMount(async () => {
  if (props.schema.async && props.schema.async.url) {
    await getOptionsList()
  } else {
    showList.value = props.options || []
  }
})
</script>