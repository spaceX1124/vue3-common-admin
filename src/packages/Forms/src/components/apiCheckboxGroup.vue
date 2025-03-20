<template>
  <el-checkbox-group
    v-bind="$attrs"
  >
    <el-checkbox v-for="(item, index) in showList" :key="index" :label="item.label" :value="item.value">
      {{ item.label }}
    </el-checkbox>
  </el-checkbox-group>
</template>

<script lang="ts" setup>
import { type Component } from 'vue'
import { useOptions } from '@/packages/Forms/src/components/utils'
import { ElCheckbox, ElCheckboxGroup } from 'element-plus'
import type { ISchema } from '@/adapter'

interface PropsType {
  component: Component,
  schema: ISchema,
}
const props = withDefaults(defineProps<PropsType>(), {
})

const { showList, getOptionsList } = useOptions(props.schema)

getOptionsList()

</script>