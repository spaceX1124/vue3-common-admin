<template>
  <SearchForm>
    <template
      v-for="slotName in delegatedSlots"
      :key="slotName"
      #[slotName]="slotProps"
    >
      <slot :name="slotName" v-bind="slotProps"/>
    </template>
    <div class="flex items-center h-8 mb-3">
      <el-button @click="clearForm">清除</el-button>
      <el-button type="primary" @click="search">搜索</el-button>
      <div class="flex ml-2 items-center text-primary text-sm pointer" @click.stop="setCollapse">
        <span>{{ formMethods.isCollapsed.value ? '展开' : '收起' }}</span>
        <Icons :icon="ChevronDown"
               :class="{ 'rotate-180': !formMethods.isCollapsed.value }"
               class="transition-transform duration-300 size-4"/>
      </div>
    </div>
  </SearchForm>
</template>
<script setup lang="ts">
import { computed, onMounted, useSlots } from 'vue'
import { useForm } from '@/adapter/form'
import type { ISchema } from '@/adapter'
import type { FormMethods } from '@/packages/Forms'
import { ChevronDown, Icons } from '@/packages/Icons'
import { removeEmptyProperties } from '@/utils/tools.ts'

interface PropsType {
  getFieldList: (formMethods?: FormMethods) => ISchema[]; // 字段数据
  gridCols?: string;
}

const props = defineProps<PropsType>()
const emit = defineEmits(['search', 'clearForm'])

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

// 搜索组件hooks
const [SearchForm, formMethods] = useForm({
  schema: [],
  hideLabel: true, // 隐藏所有表单项label
  isSearch: true, // 是搜索表单
  showCollapseButton: true, // 显示折叠按钮
  gridCols: props.gridCols || 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'
})

/**
 * 设置折叠状态
 * */
function setCollapse () {
  formMethods.setCollapse(!formMethods.isCollapsed.value)
}
/**
 * 点击搜索
 * */
function search () {
  const searchData = formMethods.getValues()
  const filterData = removeEmptyProperties(searchData)
  emit('search', filterData)
}
/**
 * 点击清除
 * */
function clearForm () {
  formMethods.clearForm()
  emit('clearForm')
}

onMounted(() => {
  formMethods.setSchema(props.getFieldList(formMethods))
})
</script>