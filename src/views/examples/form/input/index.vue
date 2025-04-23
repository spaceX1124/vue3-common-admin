<template>
  <Page>
    <div style="padding: 12px">
      <el-button type="primary" @click="btn1">一行展示一列</el-button>
      <el-button type="primary" @click="btn2">一行展示两列</el-button>
      <el-button type="primary" @click="btn3">一行展示三列</el-button>
      <el-button type="primary" @click="btn4">根据宽度自适应列数</el-button>
    </div>
    <BaseFormSelect/>
    <div>
      <el-button type="primary" @click="handleSubmit">测试提交</el-button>
    </div>
  </Page>
</template>
<script lang="ts" setup>
import Page from '@/components/page/Page.vue'
import { useForm } from '@/adapter/form'
import { ElButton } from 'element-plus'
import { fieldList } from './index'

const [BaseFormSelect, baseFormApi] = useForm({
  schema: fieldList,
  handleSubmit (values) {
    console.log(values, '数据框数据')
  }
})

function handleSubmit () {
  baseFormApi.submit()
}

function btn1 () {
  baseFormApi.updateFormLayout({
    gridCols: 'grid-cols-1'
  })
}
function btn2 () {
  baseFormApi.updateFormLayout({
    gridCols: 'grid-cols-2'
  })
}
function btn3 () {
  baseFormApi.updateFormLayout({
    gridCols: 'grid-cols-3'
  })
}
function btn4 () {
  baseFormApi.updateFormLayout({
    gridCols: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  })
}
</script>