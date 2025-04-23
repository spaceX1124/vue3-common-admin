<template>
  <div>
    <div class="text-accent">home</div>
    <div>
      <el-button type="primary" @click="showAdd">新增</el-button>
    </div>
    <AddForm v-model="show" :schema-list="schemaList" title="新增客户" width="800px" wrapperClass="grid-cols-2"/>
  </div>
</template>
<script lang="ts" setup>
import { ElButton } from 'element-plus'
import AddForm from '@/components/add-form/AddForm.vue'
import { type ISchema } from '@/adapter'
import { ref } from 'vue'
const show = ref(false)
function showAdd () {
  show.value = true
}
const schemaList = ref<ISchema[]>([
  {
    fieldKey: 'name2211',
    component: 'Input',
    fieldName: '姓名',
    required: true
  },
  {
    fieldKey: 'hobby',
    component: 'Select',
    fieldName: '爱好',
    componentProps: {
      options: [
        { label: '篮球', value: 1 },
        { label: '足球', value: 2 }
      ]
    }
  },
  {
    fieldKey: 'age',
    component: 'Input',
    fieldName: '年龄'
  },
  {
    fieldKey: 'idCard',
    component: 'Input',
    fieldName: '身份证'
  },
  {
    fieldKey: 'email',
    component: 'Input',
    fieldName: '邮箱'
  },
  {
    fieldKey: 'num',
    component: 'Input',
    fieldName: '数字'
  },
  {
    fieldKey: 'name',
    component: 'Input',
    fieldName: '名称'
  },
  {
    fieldKey: 'hh',
    component: 'Input',
    fieldName: '刚刚'
  },
  {
    fieldKey: 'name11',
    component: 'Input',
    fieldName: '名称11'
  },
  {
    fieldKey: 'hh333',
    component: 'Input',
    fieldName: '刚刚33'
  }, {
    fieldKey: 'namegg11',
    component: 'Input',
    fieldName: '名gg称11'
  },
  {
    fieldKey: 'hh33133',
    component: 'Input',
    fieldName: '刚3刚33'
  }

])
</script>