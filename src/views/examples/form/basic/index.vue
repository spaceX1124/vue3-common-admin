<template>
  <div class="h-full">
    <div class="bg-white h-full p-4 rounded-md">
      <el-tabs v-model="activeName" class="demo-tabs">
        <!--        <el-tab-pane label="输入框" name="one"><BaseFormInput/></el-tab-pane>-->
        <el-tab-pane label="下拉框" name="two"><BaseFormSelect/></el-tab-pane>
        <!--        <el-tab-pane label="单选框" name="three"><BaseFormRadio/></el-tab-pane>-->
        <!--        <el-tab-pane label="复选框" name="four"><BaseFormCheckbox/></el-tab-pane>-->
        <!--        <el-tab-pane label="区间输入" name="five"><BaseFormIntervalInput/></el-tab-pane>-->
      </el-tabs>
      <div>
        <el-button type="primary" @click="handleSubmit">测试提交</el-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useForm } from '@/adapter/form'
import { ref } from 'vue'
import { ElTabs, ElTabPane, ElButton } from 'element-plus'
import { checkboxList, inputList, intervalInputList, radioList, selectList } from './index'
import RegExpEnum from '@/utils/regExp'
const activeName = ref('two')
// const [BaseFormInput, baseFormApiInput] = useForm({
//   schema: inputList,
//   handleSubmit (values) {
//     console.log(values, '输入框数据')
//   }
// })
const [BaseFormSelect, baseFormApiSelect] = useForm({
  schema: selectList,
  handleSubmit (values) {
    console.log(values, '下拉框数据')
  }
})
// const [BaseFormRadio, baseFormApiRadio] = useForm({
//   schema: radioList,
//   handleSubmit (values) {
//     console.log(values, '单选框数据')
//   }
// })
// const [BaseFormCheckbox, baseFormApiCheckbox] = useForm({
//   schema: checkboxList,
//   handleSubmit (values) {
//     console.log(values, '复选框数据')
//   }
// })
// const [BaseFormIntervalInput, baseFormApiIntervalInput] = useForm({
//   schema: intervalInputList,
//   handleSubmit (values) {
//     console.log(values, '区间输入数据')
//   }
// })

function handleSubmit () {
  switch (activeName.value) {
    case 'one':
      baseFormApiInput.submit()
      break
    case 'two':
      baseFormApiSelect.submit()
      break
    case 'three':
      baseFormApiRadio.submit()
      break
    case 'four':
      baseFormApiCheckbox.submit()
      break
    case 'five':
      baseFormApiIntervalInput.submit()
      break
  }
}
</script>