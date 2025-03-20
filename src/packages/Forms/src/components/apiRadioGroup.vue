<template>
  <el-radio-group
    v-bind="$attrs"
  >
    <component :is="showComponent" v-for="(item, index) in showList" :key="index" :label="item.label" :value="item.value">
      {{ item.label }}
    </component>
  </el-radio-group>
</template>

<script lang="ts" setup>
import { computed, type Component } from 'vue'
import { useOptions } from '@/packages/Forms/src/components/utils'
import { ElRadio, ElRadioGroup, ElRadioButton } from 'element-plus'
import type { ISchema } from '@/adapter'

interface PropsType {
  component: Component,
  schema: ISchema,
}
const props = withDefaults(defineProps<PropsType>(), {
})

const showComponent = computed(() => {
  return props.schema?.componentProps?.isButton ? ElRadioButton : ElRadio
})

const { showList, getOptionsList } = useOptions(props.schema)

getOptionsList()

</script>