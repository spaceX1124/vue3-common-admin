<template>
  <div>
    <el-checkbox
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
      <el-checkbox v-for="(item, index) in list" :key="index" :label="item.label" :value="item.value">
        {{ item.label }}
      </el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script lang="ts" setup>
import { type Component, onMounted, ref } from 'vue'
import { type CheckboxValueType, ElCheckbox, ElCheckboxGroup } from 'element-plus'
import { useOptions } from '@/packages/Forms/src/components/utils'
import type { ISchema } from '@/adapter'

import { useFormContext } from '../hooks/useCreateContext'
const { formMethods } = useFormContext()
interface PropsType {
  component: Component,
  schema: ISchema,
  options?: Record<string, any>[]
}

const props = withDefaults(defineProps<PropsType>(), {})

const list = ref<Record<string, any>[]>([])

const checkAll = ref<boolean>(false)
const isIndeterminate = ref(false)

const handleCheckAllChange = (val: CheckboxValueType) => {
  let values = []
  val && (values = list.value.map(item => item.value))
  formMethods.setFieldValue(props.schema.fieldKey, values)
  isIndeterminate.value = false
}
const handleCheckedCitiesChange = (value: string[]) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === list.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < list.value.length
}
const { showList, getOptionsList } = useOptions(props.schema)
onMounted(async () => {
  if (props.schema.async && props.schema.async.url) {
    await getOptionsList()
    list.value = showList.value
  } else {
    list.value = props.options || []
  }
})
</script>