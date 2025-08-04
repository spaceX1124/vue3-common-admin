<template>
  <form>
    <div ref="wrapperRef" class="grid" :class="gridCols">
      <template v-for="cSchema in computedSchema" :key="cSchema.key">
        <!-- 控制当前字段是否在表单中显示 -->
        <!-- 搜索组件&当前字段可搜索 ||  表单组件&字段非隐藏-->
        <template v-if="(formMethods.isSearch && cSchema.useSearch) ||
          (
            !formMethods.isSearch && cSchema.useForm && !(isFunc(cSchema.formHidden) ? cSchema.formHidden() : cSchema.formHidden)
          )">
          <template v-if="cSchema.component === 'FormTitle'">
            <!-- 考虑一下，如何自定义title -->
            <FormTitle class="col-span-full" v-bind="cSchema"/>
          </template>
          <FormField v-else v-bind="cSchema" :class="cSchema.formItemClass" class="flex-shrink-0">
            <template #default="slotProps">
              <!-- 设置slot，外部可以设置自己的表单项 -->
              <slot v-bind="slotProps" :name="cSchema.fieldKey"/>
            </template>
          </FormField>
        </template>
      </template>
      <slot/>
    </div>
  </form>
</template>
<script lang="ts" setup>
import { FormTitle } from '../components'
import { computed } from 'vue'

import FormField from './form-field.vue'
import { useFormContext } from '../hooks/useCreateContext'
import type { ISchema } from '@/adapter'
import { useExpandable } from './expandable.ts'
import { isFunc } from '@/utils/is'

// 获取透传数据
const { config, formMethods } = useFormContext()

// 处理搜索菜单的折叠状态
const { isCalculated, keepFormItemIndex, wrapperRef } = useExpandable(formMethods)

const formCollapsed = computed(() => {
  return formMethods.isCollapsed.value && isCalculated.value
})

// 控制报表单一行展示几个，表单项的间距
const gridCols = computed(() => {
  return [formMethods.staticState.value.gridCols, formMethods.staticState.value.gutters]
})

// 得到表单数据结构，用于循环渲染
const computedSchema = computed(() => {
  // 当formMethods.state.value.schema数据更新，这儿也会对应的更新
  // item类型推导不出来，只有重新定义类型
  return formMethods.schema.value.filter((item: ISchema) => ((formMethods.isSearch && item.useSearch) || (!formMethods.isSearch && item.useForm))).map((item: ISchema, index: number) => {
    const keepIndex = keepFormItemIndex.value
    // 显示折叠按钮 & 折叠状态 & 当前索引大于保留索引-用于搜索表单
    const hidden = formMethods.showCollapseButton && formCollapsed.value && keepIndex
      ? keepIndex <= index
      : false
    // 还需要处理，有些字段在没传的情况下需要处理默认值
    return {
      hideLabel: formMethods.staticState.value.hideLabel,
      labelWidth: config.labelWidth || 100,
      ...item,
      formItemClass: hidden ? (item.formItemClass ? item.formItemClass + ' ' + 'hidden' : 'hidden') : item.formItemClass
    }
  })
})
</script>
