<template>
  <FormRender>
    <!-- 这是表单项的自定义渲染 -->
    <template
      v-for="slotName in delegatedSlots"
      :key="slotName"
      #[slotName]="slotProps"
    >
      <slot :name="slotName" v-bind="slotProps"/>
    </template>
    <!-- 这一块是在最后区域自定义表单项 -->
    <template #default="slotProps">
      <slot v-bind="slotProps"/>
    </template>
  </FormRender>
</template>
<script lang="ts" setup>
// 组件集合
import { COMPONENT_MAP, DEFAULT_COMPONENT_PROPS, COMPONENT_BIND_EVENT_MAP, CONFIG } from './initForm'
import FormRender from './form-render/form.vue'
import type { FormMethods, IFormProps } from './type'
import { onMounted, useSlots, computed, unref } from 'vue'
import { createFormContext } from './hooks/useCreateContext'
import { useForm } from 'vee-validate'

interface PropsType extends IFormProps{
  formMethods: FormMethods;
}
const props = defineProps<PropsType>()
const slots = useSlots()
const delegatedSlots = computed(() => {
  const resultSlots: string[] = []
  for (const key of Object.keys(slots)) {
    if (key !== 'default') {
      resultSlots.push(key)
    }
  }
  return resultSlots
})

// 将props.formMethods.state里面的数据转成可读的响应式数据,用于透传，当数据发生变更的时候，子孙能够动态变化
// provide
createFormContext({
  componentMap: COMPONENT_MAP, // 组件集合，
  defaultComponentProps: DEFAULT_COMPONENT_PROPS,
  componentBindEventMap: COMPONENT_BIND_EVENT_MAP,
  config: CONFIG,
  formMethods: props.formMethods
})

// useForm 是一个组合式函数，用于创建表单验证逻辑,
// 返回一个包含多个属性和方法的对象，这些属性和方法可帮助你管理表单状态、处理表单验证和提交等操作

// 处理表单初始值
const initialValues = generateInitialValues()
function generateInitialValues () {
  const initialValues: Record<string, any> = {}
  unref(props.formMethods.schema).forEach((item) => {
    if (Reflect.has(item, 'defaultValue')) {
      // 需要考虑fieldKey是多层字符串，如fieldKey = "company.taxBrackets"
      const keys = item.fieldKey.split('.')
      let current = initialValues
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i]
        // 如果当前层不存在，则创建空对象
        current[key] = current[key] || {}
        current = current[key]
      }
      current[keys[keys.length - 1]] = item.defaultValue
    }
  })
  return { ...initialValues }
}

const form = useForm({
  initialValues // 设置默认值
})

onMounted(() => {
  props.formMethods.mount(form)
})

</script>
<style></style>