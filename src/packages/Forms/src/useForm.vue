<template>
  <FormRender/>
</template>
<script lang="ts" setup>
// 组件集合
import { COMPONENT_MAP, DEFAULT_COMPONENT_PROPS, COMPONENT_BIND_EVENT_MAP, CONFIG } from './initForm'
import FormRender from './form-render/form.vue'
import type { FormMethods, IFormProps } from './type'
import { onMounted } from 'vue'
import { createFormContext } from './hooks/useCreateContext'
import { useForm } from 'vee-validate'

interface PropsType extends IFormProps{
  formMethods: FormMethods;
}
const props = defineProps<PropsType>()
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
const form = useForm()
onMounted(() => {
  props.formMethods.mount(form)
})

</script>
<style></style>